import React, { useState } from 'react';
import MedicalDataUploader from '../components/MedicalDataUploader';
import ImageViewer from '../components/ImageViewer';
import Conversation from '../components/Conversation';
import { processFile, startConversation, sendMessage } from '../services/geminiService';

function Analisis() {
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para manejar la carga de datos médicos
  const handleDataUpload = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setHistory([]);

      // Mostrar mensaje de carga
      setHistory([{
        role: 'system',
        parts: [{ text: 'Procesando información médica... Esto puede tardar unos segundos.' }]
      }]);

      // Procesar las imágenes médicas y archivos de laboratorio
      const processedFiles = [];
      const allFiles = [];

      // Procesar imágenes médicas
      if (data.imagenes && data.imagenes.length > 0) {
        for (const imagen of data.imagenes) {
          // Verificar el tamaño del archivo (máximo 4MB)
          if (imagen.size > 4 * 1024 * 1024) {
            throw new Error('Una imagen es demasiado grande. El tamaño máximo permitido es 4MB por archivo.');
          }

          // Verificar el tipo de archivo
          const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (!validTypes.includes(imagen.type)) {
            throw new Error('Formato de imagen no soportado. Por favor, usa JPG, PNG o WEBP.');
          }

          // Procesar la imagen
          const processed = await processFile(imagen);
          processed.source = 'imagenes';
          processedFiles.push(processed);
          // Añadir la propiedad source al objeto original
          imagen.source = 'imagenes';
          allFiles.push(imagen);
        }
      }

      // Procesar archivos de laboratorio
      if (data.laboratorio && data.laboratorio.length > 0) {
        for (const labFile of data.laboratorio) {
          // Verificar el tamaño del archivo (máximo 4MB)
          if (labFile.size > 4 * 1024 * 1024) {
            throw new Error('Un archivo de laboratorio es demasiado grande. El tamaño máximo permitido es 4MB por archivo.');
          }

          // Procesar solo archivos de imagen para mostrarlos en el visualizador
          if (labFile.type.startsWith('image/')) {
            const processed = await processFile(labFile);
            processed.source = 'laboratorio';
            processedFiles.push(processed);
            // Añadir la propiedad source al objeto original
            labFile.source = 'laboratorio';
            allFiles.push(labFile);
          }
        }
      }

      // Actualizar el estado de las imágenes
      setImages(allFiles);
      setUploadedFiles(processedFiles);
      setActiveImageIndex(0);

      // Preparar los datos para la API
      const medicalData = {
        imagenes: processedFiles.filter(file => file.source === 'imagenes'),
        paciente: data.paciente,
        sintomas: data.sintomas,
        historial: data.historial ? await processFile(data.historial) : null,
        laboratorio: data.laboratorio && data.laboratorio.length > 0
          ? await Promise.all(data.laboratorio.map(file => processFile(file)))
          : []
      };

      // Iniciar la conversación con los datos médicos
      try {
        const { chat, history: initialHistory, modelUsed } = await startConversation(medicalData);
        setConversation(chat);
        setHistory(initialHistory);

        // Mostrar qué modelo se está usando (si está disponible)
        if (modelUsed) {
          console.log('Usando modelo:', modelUsed);
        }
      } catch (convError) {
        console.error('Error al iniciar la conversación:', convError);

        // Si el error tiene un mensaje amigable, mostrarlo
        setHistory([{
          role: 'system',
          parts: [{ text: convError.message || 'Error al analizar la información médica. Por favor, inténtalo de nuevo.' }]
        }]);

        throw convError;
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error al procesar la información médica:', err);

      // Crear un mensaje de error amigable
      const errorMessage = err.message || 'Error al procesar la información médica. Por favor, inténtalo de nuevo.';

      // Si no hay mensajes (porque el error ocurrió antes), mostrar el error
      if (history.length === 0 || (history.length === 1 && history[0].role === 'system')) {
        setHistory([{
          role: 'system',
          parts: [{ text: errorMessage }]
        }]);
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Función para enviar un mensaje
  const handleSendMessage = async (message) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validar que el mensaje no esté vacío
      if (!message || message.trim() === '') {
        throw new Error('Por favor, escribe un mensaje antes de enviar.');
      }

      // Agregar el mensaje del usuario al historial
      const userMessage = {
        role: 'user',
        parts: [{ text: message }],
      };

      setHistory([...history, userMessage]);

      // Verificar que la conversación esté inicializada
      if (!conversation) {
        throw new Error('La conversación no está inicializada. Por favor, carga información médica primero.');
      }

      // Determinar qué archivo enviar según la pestaña activa
      let activeFile = null;

      // Si estamos en la pestaña de imágenes y hay imágenes disponibles
      if (uploadedFiles.length > 0 && activeImageIndex >= 0 && activeImageIndex < uploadedFiles.length) {
        activeFile = uploadedFiles[activeImageIndex];
      }

      // Mostrar indicador de "escribiendo..."
      const typingIndicator = {
        role: 'model',
        parts: [{ text: 'Escribiendo...' }],
        isTyping: true
      };

      setHistory(prevHistory => [...prevHistory, typingIndicator]);

      try {
        // Enviar el mensaje (con reintentos implementados en el servicio)
        const aiResponse = await sendMessage(conversation, message, activeFile);

        // Reemplazar el indicador de escritura con la respuesta real
        setHistory(prevHistory => {
          const newHistory = prevHistory.filter(msg => !msg.isTyping);
          return [...newHistory, aiResponse];
        });
      } catch (apiError) {
        console.error('Error en la respuesta de la API:', apiError);

        // Crear un mensaje de error amigable
        const errorMessage = apiError.message ||
          'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta con otra pregunta o carga nueva información médica.';

        // Reemplazar el indicador de escritura con el mensaje de error
        setHistory(prevHistory => {
          const newHistory = prevHistory.filter(msg => !msg.isTyping);
          return [
            ...newHistory,
            {
              role: 'model',
              parts: [{ text: errorMessage }],
            }
          ];
        });

        setError('Error al obtener respuesta. Por favor, intenta con otra pregunta.');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);

      // Eliminar el indicador de escritura si existe
      setHistory(prevHistory => prevHistory.filter(msg => !msg.isTyping));

      // Mostrar el error
      setError(err.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  // Función para seleccionar una imagen
  const handleSelectImage = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="analisis-page">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="page-title">Análisis Médico Avanzado</h2>
            <p className="page-description">Proporciona información médica para obtener un análisis detallado</p>
            <MedicalDataUploader onDataUpload={handleDataUpload} isLoading={isLoading} />
          </div>
        </div>

        {error && (
          <div className="row">
            <div className="col-md-12">
              <div className="alert alert-danger">{error}</div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-6">
            <ImageViewer
              images={images}
              activeIndex={activeImageIndex}
              onSelectImage={handleSelectImage}
            />
          </div>
          <div className="col-lg-6">
            {history.length > 0 ? (
              <Conversation
                history={history}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                patientInfo={uploadedFiles.length > 0 ? uploadedFiles[0].patientInfo : null}
                uploadedFiles={uploadedFiles}
              />
            ) : (
              <div className="conversation-placeholder">
                <p>Proporciona imágenes médicas, resultados de laboratorio u otra información médica para comenzar el análisis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analisis;
