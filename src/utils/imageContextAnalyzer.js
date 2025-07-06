/**
 * Analizador de Contexto de Imágenes Médicas
 * Detecta automáticamente las relaciones entre múltiples imágenes médicas
 * para optimizar el análisis diagnóstico con IA
 */

// Tipos de relaciones entre imágenes
export const IMAGE_RELATIONSHIPS = {
  SAME_STUDY: 'same_study',           // Múltiples vistas del mismo estudio
  FOLLOW_UP: 'follow_up',             // Seguimiento temporal
  COMPARISON: 'comparison',           // Comparación diagnóstica
  PROGRESSION: 'progression',         // Progresión de enfermedad
  BILATERAL: 'bilateral',             // Comparación bilateral
  UNKNOWN: 'unknown'                  // Relación no determinada
};

// Tipos de estudios médicos
export const STUDY_TYPES = {
  CHEST_XRAY: 'chest_xray',
  ABDOMINAL_XRAY: 'abdominal_xray',
  EXTREMITY_XRAY: 'extremity_xray',
  CT_SCAN: 'ct_scan',
  MRI: 'mri',
  ULTRASOUND: 'ultrasound',
  MAMMOGRAPHY: 'mammography',
  UNKNOWN: 'unknown'
};

// Vistas anatómicas comunes
export const ANATOMICAL_VIEWS = {
  FRONTAL: 'frontal',
  LATERAL: 'lateral',
  OBLIQUE: 'oblique',
  AP: 'anteroposterior',
  PA: 'posteroanterior',
  SAGITTAL: 'sagittal',
  CORONAL: 'coronal',
  AXIAL: 'axial',
  UNKNOWN: 'unknown'
};

/**
 * Extrae metadatos básicos de una imagen
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} Metadatos extraídos
 */
export const extractImageMetadata = async (imageFile) => {
  return new Promise((resolve) => {
    const metadata = {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      lastModified: new Date(imageFile.lastModified),
      studyDate: null,
      studyTime: null,
      bodyPart: null,
      projection: null,
      studyDescription: null
    };

    // Intentar extraer información del nombre del archivo
    const fileName = imageFile.name.toLowerCase();
    
    // Detectar parte del cuerpo por nombre de archivo
    if (fileName.includes('chest') || fileName.includes('torax') || fileName.includes('pecho')) {
      metadata.bodyPart = 'chest';
    } else if (fileName.includes('abdomen') || fileName.includes('abdominal')) {
      metadata.bodyPart = 'abdomen';
    } else if (fileName.includes('head') || fileName.includes('cabeza') || fileName.includes('craneo')) {
      metadata.bodyPart = 'head';
    } else if (fileName.includes('spine') || fileName.includes('columna')) {
      metadata.bodyPart = 'spine';
    }

    // Detectar proyección por nombre de archivo
    if (fileName.includes('frontal') || fileName.includes('front') || fileName.includes('pa')) {
      metadata.projection = ANATOMICAL_VIEWS.FRONTAL;
    } else if (fileName.includes('lateral') || fileName.includes('side') || fileName.includes('lat')) {
      metadata.projection = ANATOMICAL_VIEWS.LATERAL;
    } else if (fileName.includes('oblique') || fileName.includes('obl')) {
      metadata.projection = ANATOMICAL_VIEWS.OBLIQUE;
    }

    // Detectar fechas en el nombre del archivo
    const datePattern = /(\d{4}[-_]\d{2}[-_]\d{2})|(\d{2}[-_]\d{2}[-_]\d{4})/;
    const dateMatch = fileName.match(datePattern);
    if (dateMatch) {
      try {
        metadata.studyDate = new Date(dateMatch[0].replace(/[-_]/g, '/'));
      } catch (e) {
        // Ignorar errores de parsing de fecha
      }
    }

    resolve(metadata);
  });
};

/**
 * Analiza el contenido visual básico de una imagen
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} Análisis visual básico
 */
export const analyzeImageContent = async (imageFile) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Análisis básico de la imagen
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Calcular estadísticas básicas
      let totalBrightness = 0;
      let darkPixels = 0;
      let brightPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += brightness;
        
        if (brightness < 50) darkPixels++;
        if (brightness > 200) brightPixels++;
      }
      
      const totalPixels = data.length / 4;
      const avgBrightness = totalBrightness / totalPixels;
      const darkRatio = darkPixels / totalPixels;
      const brightRatio = brightPixels / totalPixels;
      
      // Determinar características de la imagen
      const analysis = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        avgBrightness,
        darkRatio,
        brightRatio,
        contrast: brightRatio - darkRatio,
        isLandscape: img.width > img.height,
        isPortrait: img.height > img.width,
        isSquare: Math.abs(img.width - img.height) < 50,
        bodyPart: null,
        projection: null,
        imageQuality: 'good' // Simplificado por ahora
      };
      
      // Heurísticas básicas para detectar tipo de imagen médica
      if (analysis.aspectRatio > 1.2 && analysis.darkRatio > 0.6) {
        analysis.bodyPart = 'chest';
        analysis.projection = analysis.isLandscape ? ANATOMICAL_VIEWS.FRONTAL : ANATOMICAL_VIEWS.LATERAL;
      } else if (analysis.isSquare && analysis.avgBrightness < 100) {
        analysis.bodyPart = 'head';
      }
      
      resolve(analysis);
    };
    
    img.onerror = () => {
      resolve({
        width: 0,
        height: 0,
        aspectRatio: 1,
        avgBrightness: 0,
        darkRatio: 0,
        brightRatio: 0,
        contrast: 0,
        isLandscape: false,
        isPortrait: false,
        isSquare: false,
        bodyPart: null,
        projection: null,
        imageQuality: 'unknown'
      });
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};

/**
 * Detecta si dos fechas corresponden al mismo día
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {boolean} True si son del mismo día
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

/**
 * Detecta si hay una secuencia temporal en los metadatos
 * @param {Array} metadataArray - Array de metadatos de imágenes
 * @returns {boolean} True si hay secuencia temporal
 */
export const hasTemporalSequence = (metadataArray) => {
  const validDates = metadataArray
    .map(m => m.studyDate)
    .filter(date => date !== null)
    .sort((a, b) => a - b);
    
  if (validDates.length < 2) return false;
  
  // Verificar si hay al menos 1 día de diferencia entre estudios
  const timeDiff = validDates[validDates.length - 1] - validDates[0];
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  return daysDiff >= 1;
};

/**
 * Detecta el contexto automáticamente entre múltiples imágenes
 * @param {Array<File>} images - Array de archivos de imagen
 * @returns {Promise<Object>} Contexto detectado
 */
export const detectImageContext = async (images) => {
  if (!images || images.length === 0) {
    return {
      relationship: IMAGE_RELATIONSHIPS.UNKNOWN,
      confidence: 0,
      studyType: STUDY_TYPES.UNKNOWN,
      anatomicalRegion: null,
      views: [],
      recommendations: ['No hay imágenes para analizar']
    };
  }

  if (images.length === 1) {
    const metadata = await extractImageMetadata(images[0]);
    const visualAnalysis = await analyzeImageContent(images[0]);
    
    return {
      relationship: IMAGE_RELATIONSHIPS.UNKNOWN,
      confidence: 1.0,
      studyType: metadata.bodyPart ? `${metadata.bodyPart}_xray` : STUDY_TYPES.UNKNOWN,
      anatomicalRegion: metadata.bodyPart || visualAnalysis.bodyPart,
      views: [metadata.projection || visualAnalysis.projection || ANATOMICAL_VIEWS.UNKNOWN],
      recommendations: ['Análisis de imagen única']
    };
  }

  // Análisis para múltiples imágenes
  const metadata = await Promise.all(images.map(img => extractImageMetadata(img)));
  const visualAnalysis = await Promise.all(images.map(img => analyzeImageContent(img)));

  const context = {
    relationship: IMAGE_RELATIONSHIPS.UNKNOWN,
    confidence: 0,
    studyType: STUDY_TYPES.UNKNOWN,
    anatomicalRegion: null,
    views: [],
    recommendations: []
  };

  // Detectar partes del cuerpo
  const bodyParts = metadata.map(m => m.bodyPart).filter(bp => bp !== null);
  const visualBodyParts = visualAnalysis.map(va => va.bodyPart).filter(bp => bp !== null);
  const allBodyParts = [...bodyParts, ...visualBodyParts];

  if (allBodyParts.length > 0) {
    const mostCommonBodyPart = allBodyParts.reduce((a, b, i, arr) =>
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
    context.anatomicalRegion = mostCommonBodyPart;
    context.studyType = `${mostCommonBodyPart}_xray`;
  }

  // Detectar vistas
  const projections = metadata.map(m => m.projection).filter(p => p !== null);
  const visualProjections = visualAnalysis.map(va => va.projection).filter(p => p !== null);
  context.views = [...projections, ...visualProjections];

  // Lógica de detección de relación
  const studyDates = metadata.map(m => m.studyDate).filter(date => date !== null);

  if (studyDates.length >= 2) {
    if (studyDates.every(date => isSameDay(date, studyDates[0]))) {
      // Mismo día = mismo estudio
      context.relationship = IMAGE_RELATIONSHIPS.SAME_STUDY;
      context.confidence = 0.8;
      context.recommendations.push('Imágenes del mismo estudio - análisis conjunto recomendado');
    } else if (hasTemporalSequence(metadata)) {
      // Diferentes fechas = seguimiento
      context.relationship = IMAGE_RELATIONSHIPS.FOLLOW_UP;
      context.confidence = 0.7;
      context.recommendations.push('Imágenes de seguimiento temporal - comparación evolutiva recomendada');
    }
  } else {
    // Sin fechas claras, usar heurísticas visuales
    const sameBodyPart = allBodyParts.length > 0 && 
      allBodyParts.every(bp => bp === allBodyParts[0]);
    
    if (sameBodyPart && context.views.length > 1) {
      context.relationship = IMAGE_RELATIONSHIPS.SAME_STUDY;
      context.confidence = 0.6;
      context.recommendations.push('Posible mismo estudio basado en región anatómica');
    } else {
      context.relationship = IMAGE_RELATIONSHIPS.COMPARISON;
      context.confidence = 0.4;
      context.recommendations.push('Relación incierta - considerar especificar contexto manualmente');
    }
  }

  // Recomendaciones específicas
  if (context.views.includes(ANATOMICAL_VIEWS.FRONTAL) && 
      context.views.includes(ANATOMICAL_VIEWS.LATERAL)) {
    context.recommendations.push('Vistas frontal y lateral detectadas - análisis ortogonal óptimo');
  }

  if (images.length > 3) {
    context.recommendations.push('Múltiples imágenes detectadas - considerar agrupación por contexto');
  }

  return context;
};

/**
 * Obtiene una descripción legible del contexto
 * @param {Object} context - Contexto detectado
 * @returns {string} Descripción del contexto
 */
export const getContextDescription = (context) => {
  const descriptions = {
    [IMAGE_RELATIONSHIPS.SAME_STUDY]: 'Mismo estudio (múltiples vistas)',
    [IMAGE_RELATIONSHIPS.FOLLOW_UP]: 'Seguimiento temporal',
    [IMAGE_RELATIONSHIPS.COMPARISON]: 'Comparación diagnóstica',
    [IMAGE_RELATIONSHIPS.PROGRESSION]: 'Progresión de enfermedad',
    [IMAGE_RELATIONSHIPS.BILATERAL]: 'Comparación bilateral',
    [IMAGE_RELATIONSHIPS.UNKNOWN]: 'Relación no determinada'
  };

  let description = descriptions[context.relationship] || 'Desconocido';
  
  if (context.anatomicalRegion) {
    description += ` - ${context.anatomicalRegion}`;
  }
  
  if (context.views.length > 0) {
    description += ` (${context.views.join(', ')})`;
  }
  
  description += ` - Confianza: ${Math.round(context.confidence * 100)}%`;
  
  return description;
};
