import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaTimes, FaCalendarAlt, FaUser, FaFileAlt, FaImage, FaTimesCircle } from 'react-icons/fa';

function DiagnosisDetailsModal({ diagnosis, onClose }) {
  if (!diagnosis) return null;

  // Formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar la conversación para mostrar solo los mensajes relevantes
  const relevantMessages = diagnosis.conversation.filter(
    msg => msg.role === 'model' || msg.role === 'user'
  );

  return (
    <div className="diagnosis-modal-overlay">
      <div className="diagnosis-modal">
        <div className="diagnosis-modal-header">
          <h3>Detalles del Diagnóstico</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="diagnosis-modal-content">
          <div className="diagnosis-info">
            <div className="diagnosis-title">
              <h4>{diagnosis.title}</h4>
              <div className="diagnosis-date">
                <FaCalendarAlt className="icon" />
                {formatDate(diagnosis.date)}
              </div>
            </div>

            {diagnosis.imageUrl && (
              <div className="diagnosis-image-thumbnail">
                <h5><FaImage className="icon" /> Imágenes Analizadas</h5>
                <div className="image-thumbnails-container">
                  <div className="image-thumbnail">
                    <img src={diagnosis.imageUrl} alt={diagnosis.title} />
                    <span className="image-name">{diagnosis.title}</span>
                  </div>
                </div>
              </div>
            )}

            {diagnosis.patientInfo && (
              <div className="patient-info-section">
                <h5><FaUser className="icon" /> Información del Paciente</h5>
                <div className="patient-info-grid">
                  {diagnosis.patientInfo.name && (
                    <div className="patient-info-item">
                      <span className="label">Nombre:</span>
                      <span className="value">{diagnosis.patientInfo.name}</span>
                    </div>
                  )}
                  {diagnosis.patientInfo.age && (
                    <div className="patient-info-item">
                      <span className="label">Edad:</span>
                      <span className="value">{diagnosis.patientInfo.age} años</span>
                    </div>
                  )}
                  {diagnosis.patientInfo.gender && (
                    <div className="patient-info-item">
                      <span className="label">Género:</span>
                      <span className="value">{diagnosis.patientInfo.gender}</span>
                    </div>
                  )}
                  {diagnosis.patientInfo.clinicalHistory && (
                    <div className="patient-info-item full-width">
                      <span className="label">Historia Clínica:</span>
                      <span className="value">{diagnosis.patientInfo.clinicalHistory}</span>
                    </div>
                  )}
                  {diagnosis.patientInfo.symptoms && (
                    <div className="patient-info-item full-width">
                      <span className="label">Síntomas:</span>
                      <span className="value">{diagnosis.patientInfo.symptoms}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {diagnosis.fileInfo && diagnosis.fileInfo.length > 0 && (
              <div className="files-info-section">
                <h5><FaFileAlt className="icon" /> Archivos Analizados</h5>
                <ul className="files-list">
                  {diagnosis.fileInfo.map((fileData, index) => (
                    <li key={index} className="file-item">
                      <span className="file-name">{fileData.file.name}</span>
                      <span className="file-type">{fileData.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="diagnosis-conversation">
              <h5>Análisis y Diagnóstico</h5>
              <div className="conversation-messages">
                {relevantMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-header">
                      {message.role === 'user' ? 'Tú' : 'MediScan AI'}
                    </div>
                    <div className="message-content">
                      {message.parts && message.parts.map((part, partIndex) => (
                        <div key={partIndex} className="message-part">
                          {part.text && (
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="diagnosis-modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            <FaTimesCircle className="icon-close" /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisDetailsModal;
