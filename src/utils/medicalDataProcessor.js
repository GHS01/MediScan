/**
 * Utilidad para el procesamiento y estructuración de datos médicos
 * Mejora la contextualización de la información médica para el análisis de IA
 */

// Categorías de síntomas comunes para estructurar la información
const SYMPTOM_CATEGORIES = {
  PAIN: 'dolor',
  RESPIRATORY: 'respiratorio',
  DIGESTIVE: 'digestivo',
  NEUROLOGICAL: 'neurológico',
  CARDIOVASCULAR: 'cardiovascular',
  MUSCULOSKELETAL: 'musculoesquelético',
  DERMATOLOGICAL: 'dermatológico',
  GENERAL: 'general'
};

// Palabras clave para identificar categorías de síntomas
const SYMPTOM_KEYWORDS = {
  [SYMPTOM_CATEGORIES.PAIN]: ['dolor', 'molestia', 'ardor', 'punzante', 'agudo', 'crónico'],
  [SYMPTOM_CATEGORIES.RESPIRATORY]: ['tos', 'disnea', 'respiración', 'asfixia', 'ahogo', 'pulmón', 'bronquios', 'asma', 'flema'],
  [SYMPTOM_CATEGORIES.DIGESTIVE]: ['náusea', 'vómito', 'diarrea', 'estreñimiento', 'abdomen', 'estómago', 'digestión', 'apetito'],
  [SYMPTOM_CATEGORIES.NEUROLOGICAL]: ['mareo', 'vértigo', 'desmayo', 'convulsión', 'temblor', 'hormigueo', 'parálisis', 'memoria', 'confusión'],
  [SYMPTOM_CATEGORIES.CARDIOVASCULAR]: ['palpitación', 'taquicardia', 'presión', 'hipertensión', 'corazón', 'edema', 'hinchazón'],
  [SYMPTOM_CATEGORIES.MUSCULOSKELETAL]: ['articulación', 'músculo', 'rigidez', 'espalda', 'cuello', 'fractura', 'torcedura', 'debilidad'],
  [SYMPTOM_CATEGORIES.DERMATOLOGICAL]: ['erupción', 'picazón', 'sarpullido', 'piel', 'lesión', 'ampolla', 'enrojecimiento'],
  [SYMPTOM_CATEGORIES.GENERAL]: ['fiebre', 'fatiga', 'cansancio', 'malestar', 'pérdida de peso', 'sudoración', 'insomnio']
};

/**
 * Analiza y estructura el texto de síntomas para identificar categorías y patrones relevantes
 * @param {string} symptomsText - Texto de síntomas ingresado por el usuario
 * @returns {Object} Síntomas estructurados con categorías y análisis
 */
export const processSymptoms = (symptomsText) => {
  if (!symptomsText || symptomsText.trim() === '') {
    return null;
  }

  const normalizedText = symptomsText.toLowerCase();
  const result = {
    original: symptomsText,
    categories: {},
    duration: extractDuration(normalizedText),
    severity: extractSeverity(normalizedText),
    structured: true
  };

  // Identificar categorías de síntomas
  for (const [category, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    const matchedKeywords = keywords.filter(keyword => normalizedText.includes(keyword));
    if (matchedKeywords.length > 0) {
      result.categories[category] = {
        detected: true,
        keywords: matchedKeywords,
        relevance: matchedKeywords.length / keywords.length // Puntuación de relevancia
      };
    }
  }

  // Extraer información sobre factores agravantes o aliviantes
  result.factors = extractFactors(normalizedText);

  return result;
};

/**
 * Extrae información sobre la duración de los síntomas
 * @param {string} text - Texto normalizado de síntomas
 * @returns {Object|null} Información sobre duración
 */
const extractDuration = (text) => {
  const durationPatterns = [
    { regex: /hace\s+(\d+)\s+día(s)?/i, unit: 'días' },
    { regex: /hace\s+(\d+)\s+semana(s)?/i, unit: 'semanas' },
    { regex: /hace\s+(\d+)\s+mes(es)?/i, unit: 'meses' },
    { regex: /hace\s+(\d+)\s+año(s)?/i, unit: 'años' },
    { regex: /desde\s+hace\s+(\d+)\s+día(s)?/i, unit: 'días' },
    { regex: /desde\s+hace\s+(\d+)\s+semana(s)?/i, unit: 'semanas' },
    { regex: /desde\s+hace\s+(\d+)\s+mes(es)?/i, unit: 'meses' },
    { regex: /desde\s+hace\s+(\d+)\s+año(s)?/i, unit: 'años' },
    { regex: /comenzaron\s+hace\s+(\d+)\s+día(s)?/i, unit: 'días' },
    { regex: /comenzaron\s+hace\s+(\d+)\s+semana(s)?/i, unit: 'semanas' },
    { regex: /comenzaron\s+hace\s+(\d+)\s+mes(es)?/i, unit: 'meses' },
    { regex: /comenzaron\s+hace\s+(\d+)\s+año(s)?/i, unit: 'años' }
  ];

  for (const pattern of durationPatterns) {
    const match = text.match(pattern.regex);
    if (match && match[1]) {
      return {
        value: parseInt(match[1]),
        unit: pattern.unit,
        text: match[0]
      };
    }
  }

  // Buscar patrones de tiempo más generales
  if (text.includes('agudo') || text.includes('reciente') || text.includes('repentino')) {
    return { type: 'agudo', text: 'Inicio agudo/reciente' };
  } else if (text.includes('crónico') || text.includes('largo tiempo') || text.includes('mucho tiempo')) {
    return { type: 'crónico', text: 'Condición crónica' };
  }

  return null;
};

/**
 * Extrae información sobre la severidad de los síntomas
 * @param {string} text - Texto normalizado de síntomas
 * @returns {Object|null} Información sobre severidad
 */
const extractSeverity = (text) => {
  const severityPatterns = [
    { keywords: ['leve', 'suave', 'ligero', 'poco', 'mínimo'], level: 'leve' },
    { keywords: ['moderado', 'medio', 'intermedio'], level: 'moderado' },
    { keywords: ['severo', 'grave', 'intenso', 'fuerte', 'insoportable', 'extremo'], level: 'severo' }
  ];

  for (const pattern of severityPatterns) {
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        return {
          level: pattern.level,
          keyword: keyword
        };
      }
    }
  }

  return null;
};

/**
 * Extrae información sobre factores que agravan o alivian los síntomas
 * @param {string} text - Texto normalizado de síntomas
 * @returns {Object} Factores identificados
 */
const extractFactors = (text) => {
  const result = {
    aggravating: [],
    relieving: []
  };

  // Patrones para factores agravantes
  const aggravatingPatterns = [
    /empeo[a-z]+ (con|cuando|al) ([^.,;]+)/i,
    /aumenta (con|cuando|al) ([^.,;]+)/i,
    /se agrava (con|cuando|al) ([^.,;]+)/i,
    /duele más (con|cuando|al) ([^.,;]+)/i
  ];

  // Patrones para factores aliviantes
  const relievingPatterns = [
    /mejo[a-z]+ (con|cuando|al) ([^.,;]+)/i,
    /alivia (con|cuando|al) ([^.,;]+)/i,
    /disminuye (con|cuando|al) ([^.,;]+)/i,
    /calma (con|cuando|al) ([^.,;]+)/i
  ];

  // Buscar factores agravantes
  for (const pattern of aggravatingPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[2]) {
      result.aggravating.push(matches[2].trim());
    }
  }

  // Buscar factores aliviantes
  for (const pattern of relievingPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[2]) {
      result.relieving.push(matches[2].trim());
    }
  }

  return result;
};

/**
 * Procesa y estructura la información del paciente
 * @param {Object} patientInfo - Información del paciente
 * @returns {Object} Información del paciente estructurada
 */
export const processPatientInfo = (patientInfo) => {
  if (!patientInfo) {
    return null;
  }

  const result = {
    ...patientInfo,
    structured: true,
    ageGroup: getAgeGroup(patientInfo.edad),
    medicalHistory: {}
  };

  // Procesar antecedentes médicos si existen
  if (patientInfo.antecedentes && patientInfo.antecedentes.trim() !== '') {
    result.medicalHistory = extractMedicalHistory(patientInfo.antecedentes);
  }

  return result;
};

/**
 * Determina el grupo de edad del paciente
 * @param {string|number} age - Edad del paciente
 * @returns {string|null} Grupo de edad
 */
const getAgeGroup = (age) => {
  if (!age) return null;
  
  const numericAge = parseInt(age);
  if (isNaN(numericAge)) return null;

  if (numericAge < 2) return 'infante';
  if (numericAge < 12) return 'niño';
  if (numericAge < 18) return 'adolescente';
  if (numericAge < 30) return 'adulto joven';
  if (numericAge < 60) return 'adulto';
  return 'adulto mayor';
};

/**
 * Extrae información estructurada de los antecedentes médicos
 * @param {string} medicalHistoryText - Texto de antecedentes médicos
 * @returns {Object} Antecedentes médicos estructurados
 */
const extractMedicalHistory = (medicalHistoryText) => {
  const normalizedText = medicalHistoryText.toLowerCase();
  
  // Categorías comunes de antecedentes médicos
  const categories = {
    chronic: extractChronicConditions(normalizedText),
    surgeries: extractSurgeries(normalizedText),
    allergies: extractAllergies(normalizedText),
    medications: extractMedications(normalizedText),
    familyHistory: extractFamilyHistory(normalizedText)
  };

  return {
    original: medicalHistoryText,
    categories: categories,
    structured: true
  };
};

/**
 * Extrae condiciones crónicas del texto de antecedentes
 * @param {string} text - Texto normalizado de antecedentes
 * @returns {Array} Condiciones crónicas identificadas
 */
const extractChronicConditions = (text) => {
  const chronicConditions = [
    'diabetes', 'hipertensión', 'asma', 'epoc', 'artritis', 'artrosis',
    'fibromialgia', 'lupus', 'esclerosis', 'parkinson', 'alzheimer',
    'epilepsia', 'migraña', 'depresión', 'ansiedad', 'hipotiroidismo',
    'hipertiroidismo', 'insuficiencia', 'cardiopatía', 'enfermedad renal'
  ];

  return chronicConditions.filter(condition => text.includes(condition));
};

/**
 * Extrae cirugías del texto de antecedentes
 * @param {string} text - Texto normalizado de antecedentes
 * @returns {Array} Cirugías identificadas
 */
const extractSurgeries = (text) => {
  const surgeryPatterns = [
    /cirug[íi]a de ([^.,;]+)/i,
    /operaci[óo]n de ([^.,;]+)/i,
    /intervenido de ([^.,;]+)/i,
    /operado de ([^.,;]+)/i
  ];

  const surgeries = [];
  for (const pattern of surgeryPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        surgeries.push(match[1].trim());
      }
    }
  }

  return surgeries;
};

/**
 * Extrae alergias del texto de antecedentes
 * @param {string} text - Texto normalizado de antecedentes
 * @returns {Array} Alergias identificadas
 */
const extractAllergies = (text) => {
  const allergyPatterns = [
    /alergia a ([^.,;]+)/i,
    /al[ée]rgico a ([^.,;]+)/i,
    /intolerancia a ([^.,;]+)/i
  ];

  const allergies = [];
  for (const pattern of allergyPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        allergies.push(match[1].trim());
      }
    }
  }

  return allergies;
};

/**
 * Extrae medicamentos del texto de antecedentes
 * @param {string} text - Texto normalizado de antecedentes
 * @returns {Array} Medicamentos identificados
 */
const extractMedications = (text) => {
  const medicationPatterns = [
    /toma ([^.,;]+)/i,
    /medicado con ([^.,;]+)/i,
    /tratamiento con ([^.,;]+)/i,
    /medicaci[óo]n ([^.,;]+)/i
  ];

  const medications = [];
  for (const pattern of medicationPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        medications.push(match[1].trim());
      }
    }
  }

  return medications;
};

/**
 * Extrae antecedentes familiares del texto de antecedentes
 * @param {string} text - Texto normalizado de antecedentes
 * @returns {Array} Antecedentes familiares identificados
 */
const extractFamilyHistory = (text) => {
  const familyPatterns = [
    /antecedentes familiares de ([^.,;]+)/i,
    /historia familiar de ([^.,;]+)/i,
    /padre con ([^.,;]+)/i,
    /madre con ([^.,;]+)/i,
    /hermano con ([^.,;]+)/i,
    /hermana con ([^.,;]+)/i,
    /abuelo con ([^.,;]+)/i,
    /abuela con ([^.,;]+)/i
  ];

  const familyHistory = [];
  for (const pattern of familyPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        familyHistory.push(match[1].trim());
      }
    }
  }

  return familyHistory;
};

/**
 * Extrae valores clave de resultados de laboratorio a partir de imágenes o documentos
 * @param {Array} labFiles - Archivos de resultados de laboratorio
 * @returns {Object} Información estructurada de resultados de laboratorio
 */
export const processLabResults = (labFiles) => {
  if (!labFiles || labFiles.length === 0) {
    return null;
  }

  // Por ahora, solo registramos los archivos disponibles
  // En una implementación completa, se utilizaría OCR para extraer valores
  return {
    files: labFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    })),
    structured: true,
    message: "Archivos de laboratorio disponibles para análisis"
  };
};

/**
 * Genera un prompt mejorado basado en la información médica estructurada
 * @param {Object} structuredData - Datos médicos estructurados
 * @returns {string} Prompt mejorado para el modelo de IA
 */
export const generateEnhancedPrompt = (structuredData) => {
  let prompt = "Analiza la siguiente información médica:\n\n";

  // Añadir información del paciente si está disponible
  if (structuredData.patientInfo && structuredData.patientInfo.structured) {
    const patient = structuredData.patientInfo;
    prompt += "## INFORMACIÓN DEL PACIENTE\n";
    
    if (patient.nombre) prompt += `Nombre: ${patient.nombre}\n`;
    if (patient.edad) prompt += `Edad: ${patient.edad} años (${patient.ageGroup})\n`;
    if (patient.genero) prompt += `Género: ${patient.genero}\n`;
    
    // Añadir antecedentes médicos estructurados
    if (patient.medicalHistory && patient.medicalHistory.structured) {
      const history = patient.medicalHistory.categories;
      
      if (history.chronic && history.chronic.length > 0) {
        prompt += `Condiciones crónicas: ${history.chronic.join(', ')}\n`;
      }
      
      if (history.surgeries && history.surgeries.length > 0) {
        prompt += `Cirugías previas: ${history.surgeries.join(', ')}\n`;
      }
      
      if (history.allergies && history.allergies.length > 0) {
        prompt += `Alergias: ${history.allergies.join(', ')}\n`;
      }
      
      if (history.medications && history.medications.length > 0) {
        prompt += `Medicación actual: ${history.medications.join(', ')}\n`;
      }
    } else if (patient.antecedentes) {
      prompt += `Antecedentes médicos: ${patient.antecedentes}\n`;
    }
    
    prompt += "\n";
  }

  // Añadir información de síntomas si está disponible
  if (structuredData.symptoms && structuredData.symptoms.structured) {
    const symptoms = structuredData.symptoms;
    prompt += "## SÍNTOMAS ACTUALES\n";
    
    // Añadir duración de los síntomas
    if (symptoms.duration) {
      prompt += `Duración: ${symptoms.duration.text || 'No especificada'}\n`;
    }
    
    // Añadir severidad de los síntomas
    if (symptoms.severity) {
      prompt += `Severidad: ${symptoms.severity.level || 'No especificada'}\n`;
    }
    
    // Añadir categorías de síntomas identificadas
    const categories = Object.entries(symptoms.categories)
      .filter(([_, data]) => data.detected)
      .map(([category, _]) => category);
    
    if (categories.length > 0) {
      prompt += `Categorías principales: ${categories.join(', ')}\n`;
    }
    
    // Añadir factores agravantes y aliviantes
    if (symptoms.factors.aggravating.length > 0) {
      prompt += `Factores agravantes: ${symptoms.factors.aggravating.join(', ')}\n`;
    }
    
    if (symptoms.factors.relieving.length > 0) {
      prompt += `Factores aliviantes: ${symptoms.factors.relieving.join(', ')}\n`;
    }
    
    // Añadir descripción original
    prompt += `\nDescripción completa: ${symptoms.original}\n\n`;
  } else if (structuredData.symptomsText) {
    prompt += "## SÍNTOMAS ACTUALES\n";
    prompt += structuredData.symptomsText + "\n\n";
  }

  // Añadir información de resultados de laboratorio si está disponible
  if (structuredData.labResults && structuredData.labResults.structured) {
    const labResults = structuredData.labResults;
    prompt += "## RESULTADOS DE LABORATORIO\n";
    
    prompt += `${labResults.files.length} archivo(s) de laboratorio disponible(s):\n`;
    labResults.files.forEach(file => {
      prompt += `- ${file.name} (${file.type})\n`;
    });
    
    prompt += "\n";
  }

  // Añadir instrucciones específicas para el análisis
  prompt += "## INSTRUCCIONES PARA EL ANÁLISIS\n";
  prompt += "1. Analiza las imágenes médicas proporcionadas en el contexto de la información clínica.\n";
  prompt += "2. Identifica hallazgos relevantes y correlaciónalos con los síntomas y antecedentes.\n";
  prompt += "3. Proporciona un análisis detallado y una interpretación preliminar.\n";
  prompt += "4. Sugiere posibles diagnósticos diferenciales basados en la evidencia disponible.\n";
  prompt += "5. Indica qué información adicional podría ser útil para un diagnóstico más preciso.\n";

  return prompt;
};
