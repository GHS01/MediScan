/**
 * Generador de Prompts Médicos Especializados
 * Crea prompts contextuales optimizados para análisis de múltiples imágenes médicas
 */

import { IMAGE_RELATIONSHIPS, STUDY_TYPES, ANATOMICAL_VIEWS } from './imageContextAnalyzer.js';

/**
 * Genera prompt especializado para análisis de mismo estudio (múltiples vistas)
 * @param {Object} context - Contexto de las imágenes
 * @param {Object} medicalData - Datos médicos adicionales
 * @returns {string} Prompt optimizado
 */
export const generateSameStudyPrompt = (context, medicalData = {}) => {
  const viewCount = context.views.length;
  const anatomicalRegion = context.anatomicalRegion || 'región anatómica';
  const views = context.views.join(', ') || 'múltiples vistas';

  let prompt = `ANÁLISIS RADIOLÓGICO INTEGRAL - MÚLTIPLES VISTAS

Eres un radiólogo experto analizando ${viewCount} imágenes del mismo estudio radiológico:
- Región anatómica: ${anatomicalRegion}
- Vistas disponibles: ${views}
- Tipo de estudio: ${context.studyType || 'radiografía'}

INSTRUCCIONES ESPECÍFICAS:
1. Analiza CADA imagen individualmente primero
2. Identifica hallazgos específicos en cada vista
3. Correlaciona hallazgos entre TODAS las vistas
4. Busca hallazgos que solo son visibles en vistas específicas
5. Proporciona un diagnóstico INTEGRAL basado en TODA la información disponible

METODOLOGÍA DE ANÁLISIS:
- Evalúa la calidad técnica de cada imagen
- Describe la anatomía normal visible en cada vista
- Identifica cualquier hallazgo patológico
- Correlaciona hallazgos entre vistas para confirmar o descartar patología
- Considera la importancia diagnóstica de cada vista

FORMATO DE RESPUESTA REQUERIDO:
## ANÁLISIS POR VISTA
[Para cada imagen, proporciona análisis detallado]

## CORRELACIÓN DIAGNÓSTICA
[Describe cómo los hallazgos se correlacionan entre vistas]

## DIAGNÓSTICO INTEGRAL
[Diagnóstico final basado en todas las imágenes]

## RECOMENDACIONES
[Sugerencias de seguimiento o estudios adicionales si es necesario]`;

  // Añadir información específica según el tipo de estudio
  if (context.anatomicalRegion === 'chest') {
    prompt += `

CONSIDERACIONES ESPECÍFICAS PARA TÓRAX:
- En vista frontal: evalúa silueta cardíaca, hilios, campos pulmonares, costofrénico
- En vista lateral: evalúa espacio retroesternal, retrocardiaco, columna dorsal
- Correlaciona hallazgos entre ambas vistas para localización tridimensional
- Busca signos de patología que pueden ser sutiles en una sola vista`;
  }

  return prompt;
};

/**
 * Genera prompt especializado para seguimiento temporal
 * @param {Object} context - Contexto de las imágenes
 * @param {Object} medicalData - Datos médicos adicionales
 * @returns {string} Prompt optimizado
 */
export const generateFollowUpPrompt = (context, medicalData = {}) => {
  const imageCount = context.views.length;
  const anatomicalRegion = context.anatomicalRegion || 'región anatómica';

  let prompt = `ANÁLISIS DE SEGUIMIENTO MÉDICO TEMPORAL

Eres un radiólogo experto analizando ${imageCount} estudios de seguimiento del mismo paciente:
- Región anatómica: ${anatomicalRegion}
- Tipo de seguimiento: evolución temporal
- Objetivo: evaluar cambios, progresión o respuesta al tratamiento

METODOLOGÍA DE ANÁLISIS TEMPORAL:
1. Analiza cada estudio individualmente
2. Identifica la secuencia cronológica (más antiguo → más reciente)
3. Compara sistemáticamente cada estudio con el anterior
4. Documenta todos los cambios observados
5. Evalúa la significancia clínica de los cambios

ASPECTOS CLAVE A EVALUAR:
- Cambios evolutivos entre estudios
- Aparición de nuevos hallazgos
- Resolución o persistencia de hallazgos previos
- Progresión o regresión de patología conocida
- Respuesta al tratamiento (si aplica)
- Estabilidad de hallazgos

FORMATO DE RESPUESTA REQUERIDO:
## ANÁLISIS INDIVIDUAL POR ESTUDIO
[Describe cada estudio por separado, en orden cronológico]

## COMPARACIÓN TEMPORAL
[Compara sistemáticamente los cambios entre estudios]

## EVALUACIÓN DE LA EVOLUCIÓN
[Interpreta la significancia clínica de los cambios]

## CONCLUSIONES DEL SEGUIMIENTO
[Resumen de la evolución y recomendaciones]`;

  return prompt;
};

/**
 * Genera prompt especializado para comparación diagnóstica
 * @param {Object} context - Contexto de las imágenes
 * @param {Object} medicalData - Datos médicos adicionales
 * @returns {string} Prompt optimizado
 */
export const generateComparisonPrompt = (context, medicalData = {}) => {
  const imageCount = context.views.length;
  const anatomicalRegion = context.anatomicalRegion || 'región anatómica';

  let prompt = `ANÁLISIS COMPARATIVO DIAGNÓSTICO

Eres un radiólogo experto realizando análisis comparativo de ${imageCount} imágenes:
- Región anatómica: ${anatomicalRegion}
- Objetivo: comparación diagnóstica para identificar diferencias significativas

METODOLOGÍA DE COMPARACIÓN:
1. Analiza cada imagen individualmente
2. Identifica hallazgos en cada imagen
3. Compara sistemáticamente los hallazgos
4. Determina similitudes y diferencias
5. Evalúa la significancia clínica de las diferencias

ASPECTOS A COMPARAR:
- Anatomía normal vs patológica
- Diferentes grados de severidad
- Patrones de enfermedad similares o diferentes
- Localización anatómica de hallazgos
- Características morfológicas

FORMATO DE RESPUESTA REQUERIDO:
## ANÁLISIS INDIVIDUAL
[Describe cada imagen por separado]

## COMPARACIÓN SISTEMÁTICA
[Compara hallazgos entre todas las imágenes]

## DIFERENCIAS SIGNIFICATIVAS
[Identifica y explica diferencias importantes]

## INTERPRETACIÓN DIAGNÓSTICA
[Conclusiones basadas en la comparación]`;

  return prompt;
};

/**
 * Genera prompt genérico para múltiples imágenes sin contexto específico
 * @param {number} imageCount - Número de imágenes
 * @param {Object} medicalData - Datos médicos adicionales
 * @returns {string} Prompt genérico
 */
export const generateGenericMultiImagePrompt = (imageCount, medicalData = {}) => {
  let prompt = `ANÁLISIS DE MÚLTIPLES IMÁGENES MÉDICAS

Eres un radiólogo experto analizando ${imageCount} imágenes médicas.

INSTRUCCIONES GENERALES:
1. Analiza cada imagen individualmente
2. Identifica el tipo de estudio y región anatómica de cada imagen
3. Describe los hallazgos en cada imagen
4. Si las imágenes están relacionadas, correlaciona los hallazgos
5. Proporciona interpretación diagnóstica integral

METODOLOGÍA:
- Evalúa la calidad técnica de cada imagen
- Identifica la anatomía y estructuras visibles
- Busca hallazgos patológicos o anormales
- Considera el contexto clínico si está disponible
- Proporciona diagnóstico diferencial cuando sea apropiado

FORMATO DE RESPUESTA:
## ANÁLISIS POR IMAGEN
[Análisis detallado de cada imagen]

## HALLAZGOS PRINCIPALES
[Resumen de hallazgos más importantes]

## INTERPRETACIÓN DIAGNÓSTICA
[Conclusiones y recomendaciones]`;

  return prompt;
};

/**
 * Añade contexto médico adicional al prompt
 * @param {string} basePrompt - Prompt base
 * @param {Object} medicalData - Datos médicos del paciente
 * @returns {string} Prompt con contexto médico añadido
 */
export const addMedicalContext = (basePrompt, medicalData) => {
  let contextualPrompt = basePrompt;

  if (medicalData.paciente) {
    const { edad, genero, antecedentes } = medicalData.paciente;
    contextualPrompt += `\n\nINFORMACIÓN DEL PACIENTE:`;
    
    if (edad) contextualPrompt += `\n- Edad: ${edad} años`;
    if (genero) contextualPrompt += `\n- Género: ${genero}`;
    if (antecedentes) contextualPrompt += `\n- Antecedentes: ${antecedentes}`;
  }

  if (medicalData.sintomas) {
    contextualPrompt += `\n\nSÍNTOMAS CLÍNICOS:\n${medicalData.sintomas}`;
  }

  if (medicalData.laboratorio && medicalData.laboratorio.length > 0) {
    contextualPrompt += `\n\nRESULTADOS DE LABORATORIO DISPONIBLES:\nSe han proporcionado ${medicalData.laboratorio.length} resultados de laboratorio para correlación clínica.`;
  }

  if (medicalData.historial) {
    contextualPrompt += `\n\nHISTORIAL MÉDICO:\nSe ha proporcionado historial médico adicional para contexto clínico.`;
  }

  contextualPrompt += `\n\nIMPORTANTE: Considera toda la información clínica disponible en tu análisis e interpretación diagnóstica.`;

  return contextualPrompt;
};

/**
 * Genera prompt optimizado basado en el contexto detectado
 * @param {Object} context - Contexto de las imágenes
 * @param {Object} medicalData - Datos médicos adicionales
 * @returns {string} Prompt optimizado
 */
export const generateOptimizedPrompt = (context, medicalData = {}) => {
  let basePrompt = '';

  // Seleccionar prompt base según el tipo de relación
  switch (context.relationship) {
    case IMAGE_RELATIONSHIPS.SAME_STUDY:
      basePrompt = generateSameStudyPrompt(context, medicalData);
      break;
    case IMAGE_RELATIONSHIPS.FOLLOW_UP:
      basePrompt = generateFollowUpPrompt(context, medicalData);
      break;
    case IMAGE_RELATIONSHIPS.COMPARISON:
      basePrompt = generateComparisonPrompt(context, medicalData);
      break;
    default:
      basePrompt = generateGenericMultiImagePrompt(context.views.length, medicalData);
  }

  // Añadir contexto médico adicional
  const contextualPrompt = addMedicalContext(basePrompt, medicalData);

  // Añadir instrucciones finales de seguridad médica
  const finalPrompt = contextualPrompt + `\n\nINSTRUCCIONES DE SEGURIDAD:
- Proporciona análisis detallado pero recuerda que esto es para fines educativos
- Sugiere consulta médica profesional para diagnóstico definitivo
- Indica limitaciones del análisis por IA cuando sea apropiado
- Usa terminología médica precisa pero explica términos complejos
- Mantén un enfoque objetivo y basado en evidencia`;

  return finalPrompt;
};

/**
 * Genera instrucciones específicas para el tipo de imagen médica
 * @param {string} studyType - Tipo de estudio
 * @param {string} anatomicalRegion - Región anatómica
 * @returns {string} Instrucciones específicas
 */
export const generateSpecificInstructions = (studyType, anatomicalRegion) => {
  const instructions = {
    chest: `
EVALUACIÓN ESPECÍFICA PARA TÓRAX:
- Silueta cardíaca: tamaño, forma, bordes
- Campos pulmonares: transparencia, patrones, nódulos
- Hilios pulmonares: tamaño, densidad, simetría
- Mediastino: anchura, contornos, masas
- Costofrénico: ángulos, derrames
- Partes blandas y esqueleto: costillas, clavículas, tejidos blandos`,

    abdomen: `
EVALUACIÓN ESPECÍFICA PARA ABDOMEN:
- Patrón de gas intestinal: distribución, dilatación
- Órganos sólidos: contornos hepáticos, esplénico, renal
- Calcificaciones: vesícula, riñones, vasos
- Masas o colecciones anormales
- Esqueleto: columna lumbar, pelvis
- Partes blandas abdominales`,

    head: `
EVALUACIÓN ESPECÍFICA PARA CRÁNEO:
- Bóveda craneal: fracturas, lesiones líticas/blásticas
- Senos paranasales: ocupación, niveles hidroaéreos
- Órbitas: fracturas, cuerpos extraños
- Articulación temporomandibular
- Tejidos blandos: tumefacciones, calcificaciones`,

    extremity: `
EVALUACIÓN ESPECÍFICA PARA EXTREMIDADES:
- Huesos: fracturas, luxaciones, lesiones
- Articulaciones: espacios, alineación, derrames
- Tejidos blandos: tumefacciones, calcificaciones
- Cuerpos extraños
- Signos de infección o inflamación`
  };

  return instructions[anatomicalRegion] || '';
};
