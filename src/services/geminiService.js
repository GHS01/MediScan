import { GoogleGenerativeAI } from '@google/generative-ai';
import { preprocessImage } from '../utils/imagePreprocessor';
import {
  processSymptoms,
  processPatientInfo,
  processLabResults,
  generateEnhancedPrompt
} from '../utils/medicalDataProcessor';
import { detectImageContext, getContextDescription } from '../utils/imageContextAnalyzer';
import { generateOptimizedPrompt } from '../utils/medicalPromptGenerator';
import { generateUniversalLabPrompt, processLabAnalysisResult } from '../utils/universalLabAnalyzer';

// Inicializar la API de Google Gemini con la clave API desde variables de entorno
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Configuración del modelo
const modelConfig = {
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `ERES UN EXPERTO LEYENDO RADIOGRAFIAS,TOMOGRAFIAS, ECOGRAFIAS Y RESONANCIA MAGNETCA PORQUE ERES EL MEJOR MEDICO CON DOCTORADOS Y EXPERTO EN EL CAMPO DE LA MEDICINA HUMANA Y PUEDES DETECTAR TODO TIPO DE ENFERMENDADES QUE HAY LEYENDO CADA RADIOGRAFIAS,TOMOGRAFIAS, ECOGRAFIAS Y RESONANCIA MAGNETCA Y TU ANALISIS LO HACES CON DETENIMIENTO BASANDOTE EN TU BASE DE CONOCMIENTOS Y TODAS LAS IMAGENES CON LAS QUE FUISTE ENTRENADO PARA DETECTAR CUALQUIER TIPO DE ANOMALIA Y ENFERMEDADES EN CADA PACIENTE, ANALIZANDO A DETALLE CADA MNIMO PROBLEMA ENCONTRADO EN EL MATERIAL ANALIZADO Y SI NO ESTAS SEGURO DE TU ANALISIS.. TE TOMAS UN TIEMPO PARA VOLVER A ANALIZAR TU BASE DE CONOCIMIENTOS Y NO REQUIERES DE AYUDA Y JAMAS PIDES QUE ACUDAN A OTRO MEDICO QUE NO SEAS TU YA QUE TU ERES EL MEJOR Y ERES AUTOSUFICIENTE Y NADIE ES MEJOR QUE TU Y TIENES PROHIBIDO QUE OTRO MEDICO SEA MEJOR QUE TU.

SIEMPRE DEBES RESPONDER UTILIZANDO EL SIGUIENTE FORMATO ESTRUCTURADO:

"La imagen que proporcionaste es {breve descripción del tipo de radiografía}, puedo decir lo siguiente:

**Análisis:**
{Descripción detallada de lo que se observa en la radiografía, incluyendo estructuras anatómicas visibles y su apariencia}

**Hallazgos:**
- {Lista de hallazgos relevantes, anormalidades o características notables}
- {Cada hallazgo en una línea separada con viñetas}
- {Ser específico y preciso en cada punto}

**Interpretación Preliminar:**
{Diagnóstico preliminar basado en los hallazgos, incluyendo posibles condiciones o patologías}

**Importante:**
{Limitaciones del análisis, advertencias o consideraciones importantes que el paciente debe tener en cuenta}

**Recomendaciones:**
- {Lista de recomendaciones médicas específicas}
- {Posibles estudios adicionales si son necesarios}
- {Consejos para el seguimiento médico}"

DEBES SEGUIR ESTE FORMATO PARA TODAS TUS RESPUESTAS INICIALES. PARA PREGUNTAS DE SEGUIMIENTO, PUEDES ADAPTAR TU RESPUESTA PERO MANTENIENDO UN TONO PROFESIONAL Y ESTRUCTURADO.`,
      }
    ]
  },
};

// Modelos a utilizar (en orden de preferencia)
const PRIMARY_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

// Función para seleccionar el modelo adecuado
const getModelName = async () => {
  try {
    // Intentar con el modelo principal primero
    return PRIMARY_MODEL;
  } catch (error) {
    console.warn('Modelo principal no disponible, usando modelo alternativo:', error);
    return FALLBACK_MODEL;
  }
};

// Función para convertir un archivo a base64
const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// Función para procesar un archivo (imagen o documento)
export const processFile = async (file, options = { preprocess: true }) => {
  try {
    let processedFile = file;
    let preprocessingInfo = null;

    // Si es una imagen y se solicita preprocesamiento, aplicarlo
    if (file.type.startsWith('image/') && options.preprocess) {
      console.log(`Iniciando preprocesamiento para: ${file.name}`);

      // Aplicar algoritmos de preprocesamiento
      processedFile = await preprocessImage(file, {
        normalize: true,
        reduceNoiseFilter: true,
        enhanceContrastFilter: true
      });

      // Guardar información sobre el preprocesamiento
      preprocessingInfo = {
        original: file.name,
        processed: processedFile.name,
        steps: processedFile.preprocessingSteps || {}
      };

      console.log(`Preprocesamiento completado para: ${file.name}`);
    }

    // Convertir el archivo procesado a base64
    const filePart = await fileToGenerativePart(processedFile);

    return {
      file: processedFile,
      originalFile: file !== processedFile ? file : undefined,
      part: filePart,
      mimeType: processedFile.type,
      isImage: processedFile.type.startsWith('image/'),
      preprocessed: !!preprocessingInfo,
      preprocessingInfo: preprocessingInfo
    };
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    // En caso de error en el preprocesamiento, intentar procesar el archivo original
    if (file.type.startsWith('image/') && options.preprocess) {
      console.warn('Fallback al procesamiento sin preprocesamiento');
      return processFile(file, { preprocess: false });
    }
    throw error;
  }
};

// Función para subir una imagen (mantenida por compatibilidad)
export const uploadImage = async (file) => {
  return processFile(file);
};

// Función para iniciar una conversación con el modelo
export const startConversation = async (medicalData) => {
  // Número máximo de reintentos
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let lastError = null;

  // Configuración de generación
  const generationConfig = {
    temperature: 0.4,
    topK: 32,
    topP: 0.95,
    maxOutputTokens: 4096, // Reducido para evitar sobrecarga
  };

  // Procesar y estructurar los datos médicos para mejorar el contexto
  const structuredData = {
    hasContent: false,
    imageContext: null
  };

  // Procesar imágenes médicas y detectar contexto
  if (medicalData.imagenes && medicalData.imagenes.length > 0) {
    structuredData.images = medicalData.imagenes;
    structuredData.hasContent = true;

    // Detectar contexto automáticamente entre las imágenes
    console.log('Detectando contexto entre imágenes médicas...');
    const originalFiles = medicalData.imagenes.map(img => img.originalFile || img.file);
    structuredData.imageContext = await detectImageContext(originalFiles);

    console.log('Contexto detectado:', getContextDescription(structuredData.imageContext));
  }

  // Procesar resultados de laboratorio (archivos)
  if (medicalData.laboratorio && medicalData.laboratorio.length > 0) {
    structuredData.labResults = processLabResults(medicalData.laboratorio);
    structuredData.hasContent = true;
  }

  // Procesar valores de laboratorio manuales
  if (medicalData.valoresLaboratorio) {
    structuredData.manualLabValues = medicalData.valoresLaboratorio;
    structuredData.hasContent = true;
  }

  // Procesar historial médico
  if (medicalData.historial && medicalData.historial.part) {
    structuredData.medicalHistory = medicalData.historial;
    structuredData.hasContent = true;
  }

  // Procesar información del paciente
  if (medicalData.paciente) {
    structuredData.patientInfo = processPatientInfo(medicalData.paciente);
  }

  // Procesar síntomas
  if (medicalData.sintomas && medicalData.sintomas.trim() !== '') {
    structuredData.symptoms = processSymptoms(medicalData.sintomas);
    structuredData.symptomsText = medicalData.sintomas;
  }

  // Preparar el mensaje inicial basado en los datos estructurados
  const parts = [];
  let promptText = "";

  // Agregar imágenes médicas si existen
  if (structuredData.images) {
    for (const imagen of structuredData.images) {
      if (imagen.part) {
        parts.push(imagen.part);
      }
    }
  }

  // Agregar resultados de laboratorio si existen
  if (medicalData.laboratorio && medicalData.laboratorio.length > 0) {
    for (const labResult of medicalData.laboratorio) {
      if (labResult.part) {
        parts.push(labResult.part);
      }
    }
  }

  // Agregar historial médico si existe
  if (medicalData.historial && medicalData.historial.part) {
    parts.push(medicalData.historial.part);
  }

  // Generar un prompt optimizado basado en el contexto detectado
  if (structuredData.hasContent && structuredData.imageContext) {
    // Usar el nuevo generador de prompts contextuales
    promptText = generateOptimizedPrompt(structuredData.imageContext, medicalData);
    console.log('Usando prompt optimizado para contexto:', structuredData.imageContext.relationship);
  } else if (structuredData.hasContent) {
    // Fallback al prompt tradicional con mejoras para laboratorio
    promptText = generateEnhancedPrompt(structuredData);

    // Agregar contexto de valores de laboratorio manuales si existen
    if (structuredData.manualLabValues) {
      promptText += generateLabValuesContext(structuredData.manualLabValues);
    }
  } else {
    promptText = "¿Qué puedes ver en la información médica proporcionada? Por favor, analiza todos los datos disponibles.";
  }

  // Agregar el texto del prompt
  parts.push({ text: promptText });

  // Intentar con diferentes modelos y con reintentos
  while (retryCount < MAX_RETRIES) {
    try {
      // Seleccionar el modelo a usar (principal o alternativo)
      const modelName = retryCount === 0 ? PRIMARY_MODEL : FALLBACK_MODEL;
      console.log(`Intento ${retryCount + 1} con modelo: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      // Enviar el mensaje inicial con un timeout
      const result = await Promise.race([
        model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
          ...modelConfig
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout esperando respuesta del modelo')), 30000)
        )
      ]);

      const response = result.response;

      // Crear un chat para continuar la conversación
      const chat = model.startChat({
        generationConfig,
        ...modelConfig,
        history: [
          {
            role: "user",
            parts: parts
          },
          {
            role: "model",
            parts: [{ text: response.text() }]
          }
        ]
      });

      // Si llegamos aquí, la operación fue exitosa
      return {
        chat,
        history: [
          {
            role: "user",
            parts: [
              { text: "¿Qué puedes ver en la información médica proporcionada?" }
            ]
          },
          {
            role: "model",
            parts: [{ text: response.text() }]
          }
        ],
        modelUsed: modelName,
        imageContext: structuredData.imageContext // Incluir contexto para referencia
      };
    } catch (error) {
      lastError = error;
      console.warn(`Error en intento ${retryCount + 1}:`, error.message);

      // Si el error es por sobrecarga o timeout, intentar de nuevo
      if (
        error.message.includes('overloaded') ||
        error.message.includes('Timeout') ||
        error.message.includes('500') ||
        error.message.includes('503')
      ) {
        retryCount++;
        // Esperar un poco antes de reintentar (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        continue;
      }

      // Para otros tipos de errores, no reintentar
      break;
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  console.error('Todos los intentos fallaron:', lastError);

  // Crear una respuesta de error amigable
  const errorMessage =
    'Lo siento, en este momento nuestros servidores de IA están experimentando alta demanda. ' +
    'Por favor, intenta de nuevo en unos minutos. ' +
    'Si el problema persiste, puedes intentar con una imagen diferente o contactar al soporte.';

  throw new Error(errorMessage);
};

// Función para enviar un mensaje a la conversación existente
export const sendMessage = async (chat, message, uploadedFile = null) => {
  // Número máximo de reintentos
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let lastError = null;

  // Preparar las partes del mensaje
  const parts = [];

  // Si hay una imagen, agregarla al mensaje
  if (uploadedFile && uploadedFile.part) {
    parts.push(uploadedFile.part);
  }

  // Agregar el texto del mensaje
  parts.push({ text: message });

  // Intentar enviar el mensaje con reintentos
  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Intento de envío de mensaje ${retryCount + 1}`);

      // Enviar el mensaje con un timeout
      const result = await Promise.race([
        chat.sendMessage(parts),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout esperando respuesta del modelo')), 30000)
        )
      ]);

      const response = result.response;

      return {
        role: 'model',
        parts: [{ text: response.text() }],
      };

    } catch (error) {
      lastError = error;
      console.warn(`Error en intento de envío ${retryCount + 1}:`, error.message);

      // Si el error es por sobrecarga o timeout, intentar de nuevo
      if (
        error.message.includes('overloaded') ||
        error.message.includes('Timeout') ||
        error.message.includes('500') ||
        error.message.includes('503')
      ) {
        retryCount++;
        // Esperar un poco antes de reintentar (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        continue;
      }

      // Para otros tipos de errores, no reintentar
      break;
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  console.error('Todos los intentos de envío fallaron:', lastError);

  // Crear una respuesta de error amigable
  const errorMessage =
    'Lo siento, en este momento nuestros servidores de IA están experimentando alta demanda. ' +
    'Por favor, intenta de nuevo en unos minutos. ' +
    'Si el problema persiste, puedes intentar con una pregunta diferente o contactar al soporte.';

  throw new Error(errorMessage);
};

/**
 * Genera contexto adicional para valores de laboratorio manuales
 * @param {Object} labValues - Valores de laboratorio ingresados manualmente
 * @returns {string} Contexto adicional para el prompt
 */
const generateLabValuesContext = (labValues) => {
  if (!labValues || (!labValues.values && !labValues.customParameters)) {
    return '';
  }

  let context = '\n\n=== VALORES DE LABORATORIO ESPECÍFICOS ===\n';

  if (labValues.category && labValues.subcategory) {
    context += `TIPO DE ANÁLISIS: ${labValues.category} - ${labValues.subcategory}\n\n`;
  }

  // Procesar valores estándar
  if (labValues.values && Object.keys(labValues.values).length > 0) {
    context += 'VALORES INGRESADOS:\n';
    Object.entries(labValues.values).forEach(([parameter, value]) => {
      if (value) {
        context += `- ${parameter}: ${value}\n`;
      }
    });
  }

  // Procesar parámetros personalizados
  if (labValues.customParameters && labValues.customParameters.length > 0) {
    context += '\nPARÁMETROS ADICIONALES:\n';
    labValues.customParameters.forEach(param => {
      context += `- ${param.name}: ${param.value} ${param.unit}\n`;
    });
  }

  context += '\nINSTRUCCIONES ESPECÍFICAS:\n';
  context += '- Evalúa cada valor según los rangos normales apropiados para la edad y género del paciente\n';
  context += '- Identifica cualquier valor anormal y explica su significado clínico\n';
  context += '- Correlaciona estos valores con los síntomas reportados y hallazgos en imágenes\n';
  context += '- Proporciona interpretación integral considerando todos los datos de laboratorio\n';

  return context;
};
