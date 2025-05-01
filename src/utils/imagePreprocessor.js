/**
 * Utilidad para el preprocesamiento de imágenes médicas
 * Mejora la calidad de las imágenes antes de enviarlas a la IA para obtener mejores resultados
 */

// Función para crear un canvas a partir de una imagen
const createCanvasFromImage = (image) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve({ canvas, ctx, width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(image);
  });
};

// Función para convertir canvas a Blob/File
const canvasToFile = (canvas, originalFile) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      // Crear un nuevo archivo con el mismo nombre pero procesado
      const processedFile = new File([blob], `processed_${originalFile.name}`, {
        type: originalFile.type,
        lastModified: new Date().getTime()
      });
      resolve(processedFile);
    }, originalFile.type);
  });
};

// Normalización de imágenes (ajuste de brillo y contraste)
const normalizeImage = async (imageFile) => {
  const { canvas, ctx, width, height } = await createCanvasFromImage(imageFile);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Calcular valores mínimos y máximos
  let min = 255;
  let max = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Usar luminosidad (0.299R + 0.587G + 0.114B)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    if (luminance < min) min = luminance;
    if (luminance > max) max = luminance;
  }
  
  // Normalizar usando los valores mínimos y máximos
  const range = max - min;
  if (range > 0) {
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // Normalizar cada canal de color
        const value = data[i + j];
        data[i + j] = Math.round(((value - min) / range) * 255);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToFile(canvas, imageFile);
};

// Reducción de ruido (filtro de mediana simplificado)
const reduceNoise = async (imageFile) => {
  const { canvas, ctx, width, height } = await createCanvasFromImage(imageFile);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const tempData = new Uint8ClampedArray(data);
  
  // Aplicar un filtro de mediana simplificado (3x3)
  const radius = 1; // Radio del kernel
  
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      for (let c = 0; c < 3; c++) { // Para cada canal de color (R, G, B)
        const values = [];
        
        // Recopilar valores de los píxeles vecinos
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4 + c;
            values.push(data[idx]);
          }
        }
        
        // Ordenar y obtener el valor medio (mediana)
        values.sort((a, b) => a - b);
        const medianValue = values[Math.floor(values.length / 2)];
        
        // Establecer el nuevo valor
        const targetIdx = (y * width + x) * 4 + c;
        tempData[targetIdx] = medianValue;
      }
    }
  }
  
  // Actualizar los datos de la imagen
  for (let i = 0; i < data.length; i++) {
    data[i] = tempData[i];
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToFile(canvas, imageFile);
};

// Mejora de contraste (ecualización de histograma)
const enhanceContrast = async (imageFile) => {
  const { canvas, ctx, width, height } = await createCanvasFromImage(imageFile);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Calcular histograma
  const histogram = new Array(256).fill(0);
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convertir a escala de grises para el histograma
    const grayValue = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[grayValue]++;
  }
  
  // Calcular la función de distribución acumulativa (CDF)
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0] / totalPixels;
  
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i] / totalPixels;
  }
  
  // Aplicar ecualización
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      const value = data[i + j];
      // Aplicar la transformación de ecualización
      data[i + j] = Math.round(cdf[value] * 255);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvasToFile(canvas, imageFile);
};

// Función principal para preprocesar una imagen
export const preprocessImage = async (imageFile, options = {}) => {
  const {
    normalize = true,
    reduceNoiseFilter = true,
    enhanceContrastFilter = true
  } = options;
  
  console.log(`Preprocesando imagen: ${imageFile.name}`);
  
  let processedImage = imageFile;
  
  try {
    // Aplicar normalización
    if (normalize) {
      console.log('Aplicando normalización...');
      processedImage = await normalizeImage(processedImage);
    }
    
    // Aplicar reducción de ruido
    if (reduceNoiseFilter) {
      console.log('Aplicando reducción de ruido...');
      processedImage = await reduceNoise(processedImage);
    }
    
    // Aplicar mejora de contraste
    if (enhanceContrastFilter) {
      console.log('Aplicando mejora de contraste...');
      processedImage = await enhanceContrast(processedImage);
    }
    
    console.log(`Preprocesamiento completado para: ${imageFile.name}`);
    
    // Añadir metadatos para indicar que la imagen ha sido procesada
    processedImage.preprocessed = true;
    processedImage.originalFile = imageFile;
    processedImage.preprocessingSteps = {
      normalize,
      reduceNoiseFilter,
      enhanceContrastFilter
    };
    
    return processedImage;
  } catch (error) {
    console.error('Error durante el preprocesamiento de la imagen:', error);
    // En caso de error, devolver la imagen original
    return imageFile;
  }
};

// Función para preprocesar múltiples imágenes
export const preprocessImages = async (imageFiles, options = {}) => {
  const results = [];
  
  for (const imageFile of imageFiles) {
    // Solo procesar archivos de imagen
    if (imageFile.type.startsWith('image/')) {
      const processedImage = await preprocessImage(imageFile, options);
      results.push(processedImage);
    } else {
      // Si no es una imagen, mantenerla sin cambios
      results.push(imageFile);
    }
  }
  
  return results;
};
