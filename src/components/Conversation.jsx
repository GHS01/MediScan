import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPaperPlane, FaSpinner, FaRobot, FaSave, FaArchive } from 'react-icons/fa';
import { saveDiagnosisToHistory } from '../services/storageService';
import { useNavigate } from 'react-router-dom';
import SaveDiagnosisModal from './SaveDiagnosisModal';

const Conversation = ({ history, onSendMessage, isLoading, patientInfo, uploadedFiles }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para desplazarse al final de la conversación
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Desplazarse al final cuando cambia el historial
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Función para renderizar el contenido del mensaje
  const renderMessageContent = (item) => {
    // Si es un mensaje de "escribiendo..."
    if (item.isTyping) {
      return (
        <div className="typing-indicator">
          <FaSpinner className="spinner" />
          <span>Escribiendo...</span>
        </div>
      );
    }

    // Si es un mensaje del sistema (error o información)
    if (item.role === 'system') {
      return (
        <div className="system-message-content">
          {item.parts.map((part, partIndex) => {
            if (part.text) {
              return <div key={partIndex} className="system-text">{part.text}</div>;
            }
            return null;
          })}
        </div>
      );
    }

    // Mensaje normal (usuario o IA)
    return (
      <div className="message-content">
        {item.parts.map((part, partIndex) => {
          if (part.text) {
            return (
              <ReactMarkdown key={partIndex}>
                {part.text}
              </ReactMarkdown>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Función para mostrar el modal de guardar diagnóstico
  const handleArchiveDiagnosis = () => {
    setShowSaveModal(true);
  };

  // Función para cancelar el guardado
  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  // Función para guardar el diagnóstico con nombre personalizado
  const handleSaveDiagnosis = (customName) => {
    // Obtener la URL de la imagen si existe
    let imageUrl = null;

    if (uploadedFiles && uploadedFiles.length > 0) {
      // Si es una imagen, guardar la URL
      const firstFile = uploadedFiles[0].file;
      if (firstFile.type.startsWith('image/')) {
        imageUrl = URL.createObjectURL(firstFile);
      }
    }

    // Crear el objeto de diagnóstico con el nombre personalizado
    const diagnosisData = {
      title: customName, // Usar el nombre personalizado
      imageUrl: imageUrl,
      conversation: history,
      patientInfo: patientInfo,
      fileInfo: uploadedFiles
    };

    // Guardar en el historial
    const saved = saveDiagnosisToHistory(diagnosisData);

    // Cerrar el modal
    setShowSaveModal(false);

    if (saved) {
      // Mostrar mensaje de éxito
      alert('Diagnóstico archivado correctamente');
      // Redirigir al historial
      navigate('/historial');
    } else {
      // Mostrar mensaje de error
      alert('Error al archivar el diagnóstico. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <div className="conversation-title">Análisis Médico con IA</div>
        <div className="conversation-actions">
          {/* Espacio para futuros botones de acción si son necesarios */}
        </div>
      </div>

      <div className="messages-container">
        {history.map((item, index) => {
          // Determinar la clase del mensaje
          let messageClass = 'message';
          if (item.role === 'user') {
            messageClass += ' user-message';
          } else if (item.role === 'model' || item.role === 'assistant') {
            messageClass += ' ai-message';
          } else if (item.role === 'system') {
            messageClass += ' system-message';
          }

          // Agregar clase si está escribiendo
          if (item.isTyping) {
            messageClass += ' typing';
          }

          return (
            <div key={index} className={messageClass}>
              {item.role !== 'system' && (
                <div className="message-header">
                  {item.role === 'user' ? 'Tú' : 'MediScan AI'}
                </div>
              )}
              {renderMessageContent(item)}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Haz una pregunta sobre el análisis médico..."
          disabled={isLoading}
          className="message-input"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="send-button"
          title="Enviar mensaje"
        >
          {isLoading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
        </button>
      </form>

      {/* Botón de archivar diagnóstico en la parte inferior */}
      {history.length > 1 && !isLoading && (
        <div className="archive-diagnosis-footer">
          <button
            className="archive-diagnosis-button"
            onClick={handleArchiveDiagnosis}
          >
            <FaArchive className="archive-icon" /> Archivar Diagnóstico
          </button>
        </div>
      )}

      {/* Modal para guardar diagnóstico con nombre personalizado */}
      {showSaveModal && (
        <SaveDiagnosisModal
          onSave={handleSaveDiagnosis}
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
};

export default Conversation;
