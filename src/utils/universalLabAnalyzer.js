/**
 * Analizador Universal de Laboratorio
 * Sistema integral para análisis de todo tipo de resultados médicos
 */

// Base de conocimiento de análisis médicos
export const LAB_CATEGORIES = {
  BLOOD: {
    name: 'Análisis de Sangre',
    subcategories: {
      HEMATOLOGY: {
        name: 'Hematología',
        parameters: [
          { name: 'Hemoglobina', unit: 'g/dL', normalRange: { male: '13.5-17.5', female: '12.0-16.0' } },
          { name: 'Hematocrito', unit: '%', normalRange: { male: '41-53', female: '36-46' } },
          { name: 'Leucocitos', unit: '/μL', normalRange: '4,000-11,000' },
          { name: 'Plaquetas', unit: '/μL', normalRange: '150,000-450,000' },
          { name: 'Neutrófilos', unit: '%', normalRange: '50-70' },
          { name: 'Linfocitos', unit: '%', normalRange: '20-40' }
        ]
      },
      CHEMISTRY: {
        name: 'Química Sanguínea',
        parameters: [
          { name: 'Glucosa', unit: 'mg/dL', normalRange: '70-100', fasting: true },
          { name: 'Creatinina', unit: 'mg/dL', normalRange: { male: '0.7-1.3', female: '0.6-1.1' } },
          { name: 'Urea', unit: 'mg/dL', normalRange: '7-20' },
          { name: 'Ácido úrico', unit: 'mg/dL', normalRange: { male: '3.5-7.2', female: '2.6-6.0' } },
          { name: 'Sodio', unit: 'mEq/L', normalRange: '136-145' },
          { name: 'Potasio', unit: 'mEq/L', normalRange: '3.5-5.1' },
          { name: 'Cloro', unit: 'mEq/L', normalRange: '98-107' }
        ]
      },
      LIPIDS: {
        name: 'Perfil Lipídico',
        parameters: [
          { name: 'Colesterol total', unit: 'mg/dL', normalRange: '<200', optimal: '<200' },
          { name: 'HDL', unit: 'mg/dL', normalRange: { male: '>40', female: '>50' } },
          { name: 'LDL', unit: 'mg/dL', normalRange: '<100', optimal: '<70' },
          { name: 'Triglicéridos', unit: 'mg/dL', normalRange: '<150' }
        ]
      },
      LIVER: {
        name: 'Función Hepática',
        parameters: [
          { name: 'ALT', unit: 'U/L', normalRange: { male: '10-40', female: '7-35' } },
          { name: 'AST', unit: 'U/L', normalRange: { male: '10-40', female: '9-32' } },
          { name: 'Bilirrubina total', unit: 'mg/dL', normalRange: '0.3-1.2' },
          { name: 'Bilirrubina directa', unit: 'mg/dL', normalRange: '0.0-0.3' },
          { name: 'Fosfatasa alcalina', unit: 'U/L', normalRange: '44-147' },
          { name: 'Albúmina', unit: 'g/dL', normalRange: '3.5-5.0' }
        ]
      },
      CARDIAC: {
        name: 'Marcadores Cardíacos',
        parameters: [
          { name: 'Troponina I', unit: 'ng/mL', normalRange: '<0.04', critical: '>0.04' },
          { name: 'Troponina T', unit: 'ng/mL', normalRange: '<0.01', critical: '>0.01' },
          { name: 'CK-MB', unit: 'ng/mL', normalRange: '<6.3' },
          { name: 'CK total', unit: 'U/L', normalRange: { male: '30-200', female: '30-135' } }
        ]
      },
      THYROID: {
        name: 'Función Tiroidea',
        parameters: [
          { name: 'TSH', unit: 'mIU/L', normalRange: '0.27-4.2' },
          { name: 'T4 libre', unit: 'ng/dL', normalRange: '0.93-1.7' },
          { name: 'T3 libre', unit: 'pg/mL', normalRange: '2.0-4.4' },
          { name: 'T4 total', unit: 'μg/dL', normalRange: '4.5-12.0' }
        ]
      }
    }
  },
  URINE: {
    name: 'Análisis de Orina',
    subcategories: {
      BASIC: {
        name: 'Uroanálisis Básico',
        parameters: [
          { name: 'Densidad', unit: '', normalRange: '1.003-1.030' },
          { name: 'pH', unit: '', normalRange: '4.6-8.0' },
          { name: 'Proteínas', unit: 'mg/dL', normalRange: 'Negativo o trazas' },
          { name: 'Glucosa', unit: 'mg/dL', normalRange: 'Negativo' },
          { name: 'Cetonas', unit: 'mg/dL', normalRange: 'Negativo' },
          { name: 'Sangre', unit: '', normalRange: 'Negativo' },
          { name: 'Leucocitos', unit: '/campo', normalRange: '0-5' },
          { name: 'Eritrocitos', unit: '/campo', normalRange: '0-3' },
          { name: 'Bacterias', unit: '', normalRange: 'Escasas' }
        ]
      },
      MICROSCOPY: {
        name: 'Sedimento Urinario',
        parameters: [
          { name: 'Cilindros hialinos', unit: '/campo', normalRange: '0-2' },
          { name: 'Cilindros granulosos', unit: '/campo', normalRange: 'Ausentes' },
          { name: 'Cristales', unit: '', normalRange: 'Escasos' },
          { name: 'Células epiteliales', unit: '/campo', normalRange: 'Escasas' }
        ]
      }
    }
  },
  STOOL: {
    name: 'Análisis de Heces',
    subcategories: {
      BASIC: {
        name: 'Coproanálisis',
        parameters: [
          { name: 'Consistencia', unit: '', normalRange: 'Formada' },
          { name: 'Color', unit: '', normalRange: 'Marrón' },
          { name: 'Sangre oculta', unit: '', normalRange: 'Negativo' },
          { name: 'Leucocitos', unit: '/campo', normalRange: '0-5' },
          { name: 'Eritrocitos', unit: '/campo', normalRange: 'Ausentes' },
          { name: 'Parásitos', unit: '', normalRange: 'Ausentes' },
          { name: 'Quistes', unit: '', normalRange: 'Ausentes' }
        ]
      },
      CULTURE: {
        name: 'Coprocultivo',
        parameters: [
          { name: 'Flora normal', unit: '', normalRange: 'Presente' },
          { name: 'Patógenos', unit: '', normalRange: 'Ausentes' },
          { name: 'Salmonella', unit: '', normalRange: 'Ausente' },
          { name: 'Shigella', unit: '', normalRange: 'Ausente' },
          { name: 'E. coli patógena', unit: '', normalRange: 'Ausente' }
        ]
      }
    }
  },
  SPECIALIZED: {
    name: 'Análisis Especializados',
    subcategories: {
      HORMONES: {
        name: 'Perfil Hormonal',
        parameters: [
          { name: 'Cortisol', unit: 'μg/dL', normalRange: '6.2-19.4' },
          { name: 'Insulina', unit: 'μU/mL', normalRange: '2.6-24.9' },
          { name: 'Testosterona', unit: 'ng/dL', normalRange: { male: '264-916', female: '15-70' } },
          { name: 'Estradiol', unit: 'pg/mL', normalRange: 'Variable según ciclo' },
          { name: 'Progesterona', unit: 'ng/mL', normalRange: 'Variable según ciclo' }
        ]
      },
      TUMOR_MARKERS: {
        name: 'Marcadores Tumorales',
        parameters: [
          { name: 'PSA', unit: 'ng/mL', normalRange: '<4.0' },
          { name: 'CA 125', unit: 'U/mL', normalRange: '<35' },
          { name: 'CA 19-9', unit: 'U/mL', normalRange: '<37' },
          { name: 'CEA', unit: 'ng/mL', normalRange: '<5.0' },
          { name: 'AFP', unit: 'ng/mL', normalRange: '<10' }
        ]
      },
      COAGULATION: {
        name: 'Coagulación',
        parameters: [
          { name: 'Tiempo de protrombina', unit: 'seg', normalRange: '11-13' },
          { name: 'INR', unit: '', normalRange: '0.8-1.1' },
          { name: 'PTT', unit: 'seg', normalRange: '25-35' },
          { name: 'Fibrinógeno', unit: 'mg/dL', normalRange: '200-400' }
        ]
      }
    }
  }
};

/**
 * Genera prompt universal para análisis de cualquier tipo de laboratorio
 * @param {File} labFile - Archivo de laboratorio
 * @param {Object} patientData - Datos del paciente
 * @returns {string} Prompt especializado
 */
export const generateUniversalLabPrompt = (labFile, patientData = {}) => {
  const fileName = labFile.name.toLowerCase();
  const detectedType = detectLabType(fileName);
  
  let prompt = `
ANÁLISIS UNIVERSAL DE LABORATORIO MÉDICO

ARCHIVO: ${labFile.name}
TIPO DETECTADO: ${detectedType.name}
PACIENTE: ${patientData.edad ? `${patientData.edad} años` : 'Edad no especificada'}, ${patientData.genero || 'Género no especificado'}

INSTRUCCIONES ESPECÍFICAS:
1. IDENTIFICA el tipo de análisis (sangre, orina, heces, especializado)
2. EXTRAE todos los valores numéricos visibles con sus unidades
3. ASOCIA cada valor con su parámetro correspondiente
4. EVALÚA si los valores están dentro del rango normal
5. IDENTIFICA valores críticos o anormales
6. CORRELACIONA con edad, género y antecedentes del paciente

PARÁMETROS ESPERADOS PARA ${detectedType.name.toUpperCase()}:
${generateExpectedParameters(detectedType)}

FORMATO DE RESPUESTA REQUERIDO:
## TIPO DE ANÁLISIS
[Especificar: Hematología, Química sanguínea, Uroanálisis, etc.]

## VALORES IDENTIFICADOS
- Parámetro: Valor Unidad (Rango normal) - Estado
- Ejemplo: Hemoglobina: 12.5 g/dL (12.0-16.0) - Normal
- Ejemplo: Glucosa: 180 mg/dL (70-100) - ⚠️ ELEVADO

## VALORES CRÍTICOS
[Listar cualquier valor fuera del rango normal]

## INTERPRETACIÓN CLÍNICA
[Análisis contextual considerando edad, género, síntomas]

## RECOMENDACIONES
[Sugerencias basadas en los hallazgos]

IMPORTANTE: Si no puedes leer claramente algún valor, indícalo específicamente.
  `;

  return prompt;
};

/**
 * Detecta el tipo de análisis basado en el nombre del archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {Object} Tipo de análisis detectado
 */
const detectLabType = (fileName) => {
  const bloodKeywords = ['hemograma', 'sangre', 'hematologia', 'quimica', 'lipidos', 'glucosa', 'colesterol'];
  const urineKeywords = ['orina', 'urinario', 'uro'];
  const stoolKeywords = ['heces', 'copro', 'parasitos'];
  const specializedKeywords = ['hormonal', 'tiroides', 'cardiac', 'tumor', 'coagulacion'];

  if (bloodKeywords.some(keyword => fileName.includes(keyword))) {
    return { type: 'BLOOD', name: 'Análisis de Sangre' };
  } else if (urineKeywords.some(keyword => fileName.includes(keyword))) {
    return { type: 'URINE', name: 'Análisis de Orina' };
  } else if (stoolKeywords.some(keyword => fileName.includes(keyword))) {
    return { type: 'STOOL', name: 'Análisis de Heces' };
  } else if (specializedKeywords.some(keyword => fileName.includes(keyword))) {
    return { type: 'SPECIALIZED', name: 'Análisis Especializado' };
  } else {
    return { type: 'UNKNOWN', name: 'Análisis General' };
  }
};

/**
 * Genera lista de parámetros esperados para el tipo de análisis
 * @param {Object} labType - Tipo de análisis detectado
 * @returns {string} Lista de parámetros esperados
 */
const generateExpectedParameters = (labType) => {
  if (!LAB_CATEGORIES[labType.type]) {
    return 'Parámetros generales de laboratorio';
  }

  const category = LAB_CATEGORIES[labType.type];
  let parametersList = '';

  Object.values(category.subcategories).forEach(subcategory => {
    parametersList += `\n${subcategory.name}:\n`;
    subcategory.parameters.forEach(param => {
      const range = typeof param.normalRange === 'object' 
        ? `${param.normalRange.male || param.normalRange.female}` 
        : param.normalRange;
      parametersList += `  - ${param.name} (${param.unit}): ${range}\n`;
    });
  });

  return parametersList;
};

/**
 * Analiza resultado de laboratorio con contexto del paciente
 * @param {string} analysisResult - Resultado del análisis de Gemini
 * @param {Object} patientData - Datos del paciente
 * @returns {Object} Análisis estructurado
 */
export const processLabAnalysisResult = (analysisResult, patientData) => {
  const result = {
    type: extractLabType(analysisResult),
    values: extractValues(analysisResult),
    criticalValues: extractCriticalValues(analysisResult),
    interpretation: extractInterpretation(analysisResult),
    recommendations: extractRecommendations(analysisResult),
    patientContext: {
      age: patientData.edad,
      gender: patientData.genero,
      relevantHistory: patientData.antecedentes
    }
  };

  return result;
};

/**
 * Extrae valores del análisis
 * @param {string} text - Texto del análisis
 * @returns {Array} Valores extraídos
 */
const extractValues = (text) => {
  const values = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    // Buscar patrón: Parámetro: Valor Unidad (Rango) - Estado
    const match = line.match(/^-?\s*([^:]+):\s*([0-9.,]+)\s*([^(]*)\s*\(([^)]+)\)\s*-\s*(.+)$/);
    if (match) {
      values.push({
        parameter: match[1].trim(),
        value: parseFloat(match[2].replace(',', '.')),
        unit: match[3].trim(),
        normalRange: match[4].trim(),
        status: match[5].trim()
      });
    }
  });

  return values;
};

/**
 * Extrae valores críticos
 * @param {string} text - Texto del análisis
 * @returns {Array} Valores críticos
 */
const extractCriticalValues = (text) => {
  const criticalSection = text.match(/## VALORES CRÍTICOS\s*([\s\S]*?)(?=##|$)/);
  if (!criticalSection) return [];

  const criticalValues = [];
  const lines = criticalSection[1].split('\n');
  
  lines.forEach(line => {
    if (line.trim() && line.includes('⚠️') || line.includes('ELEVADO') || line.includes('BAJO')) {
      criticalValues.push(line.trim());
    }
  });

  return criticalValues;
};

/**
 * Extrae interpretación clínica
 * @param {string} text - Texto del análisis
 * @returns {string} Interpretación
 */
const extractInterpretation = (text) => {
  const interpretationSection = text.match(/## INTERPRETACIÓN CLÍNICA\s*([\s\S]*?)(?=##|$)/);
  return interpretationSection ? interpretationSection[1].trim() : '';
};

/**
 * Extrae recomendaciones
 * @param {string} text - Texto del análisis
 * @returns {string} Recomendaciones
 */
const extractRecommendations = (text) => {
  const recommendationsSection = text.match(/## RECOMENDACIONES\s*([\s\S]*?)(?=##|$)/);
  return recommendationsSection ? recommendationsSection[1].trim() : '';
};

/**
 * Extrae tipo de laboratorio del análisis
 * @param {string} text - Texto del análisis
 * @returns {string} Tipo de análisis
 */
const extractLabType = (text) => {
  const typeSection = text.match(/## TIPO DE ANÁLISIS\s*([\s\S]*?)(?=##|$)/);
  return typeSection ? typeSection[1].trim() : 'No especificado';
};
