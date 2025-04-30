// Servicio para manejar el almacenamiento local de datos

// Función para guardar un diagnóstico en el historial
export const saveDiagnosisToHistory = (diagnosisData) => {
  try {
    // Obtener el historial actual del localStorage
    const currentHistory = localStorage.getItem('mediscanHistory');
    let historyArray = [];
    
    if (currentHistory) {
      historyArray = JSON.parse(currentHistory);
    }
    
    // Añadir el nuevo diagnóstico al principio del array
    historyArray.unshift({
      id: Date.now(), // Usar timestamp como ID único
      date: new Date().toISOString(),
      title: diagnosisData.title || 'Análisis sin título',
      imageUrl: diagnosisData.imageUrl || null,
      conversation: diagnosisData.conversation || [],
      patientInfo: diagnosisData.patientInfo || null,
      fileInfo: diagnosisData.fileInfo || null
    });
    
    // Guardar el historial actualizado en localStorage
    localStorage.setItem('mediscanHistory', JSON.stringify(historyArray));
    
    return true;
  } catch (error) {
    console.error('Error al guardar el diagnóstico en el historial:', error);
    return false;
  }
};

// Función para obtener todo el historial de diagnósticos
export const getDiagnosisHistory = () => {
  try {
    const history = localStorage.getItem('mediscanHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error al obtener el historial de diagnósticos:', error);
    return [];
  }
};

// Función para obtener un diagnóstico específico por ID
export const getDiagnosisById = (id) => {
  try {
    const history = getDiagnosisHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error al obtener el diagnóstico:', error);
    return null;
  }
};

// Función para eliminar un diagnóstico del historial
export const deleteDiagnosisFromHistory = (id) => {
  try {
    const history = getDiagnosisHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('mediscanHistory', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error al eliminar el diagnóstico:', error);
    return false;
  }
};
