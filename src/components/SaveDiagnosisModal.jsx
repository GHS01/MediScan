import React, { useState } from 'react';
import { FaSave, FaTimes, FaFileAlt } from 'react-icons/fa';

function SaveDiagnosisModal({ onSave, onCancel }) {
  const [diagnosisName, setDiagnosisName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que se haya ingresado un nombre
    if (!diagnosisName.trim()) {
      setError('Por favor, ingresa un nombre para el diagnóstico');
      return;
    }

    // Llamar a la función onSave con el nombre personalizado
    onSave(diagnosisName);
  };

  return (
    <div className="save-diagnosis-modal-overlay" onClick={(e) => {
      // Cerrar el modal si se hace clic fuera de él
      if (e.target.className === 'save-diagnosis-modal-overlay') {
        onCancel();
      }
    }}>
      <div className="save-diagnosis-modal">
        <div className="save-diagnosis-modal-content">
          <div className="save-diagnosis-icon">
            <FaFileAlt />
          </div>
          <h2>Guardar Diagnóstico</h2>

          <form onSubmit={handleSubmit} className="save-diagnosis-form">
            <div className="form-group">
              <label htmlFor="diagnosis-name">Nombre del diagnóstico:</label>
              <input
                type="text"
                id="diagnosis-name"
                value={diagnosisName}
                onChange={(e) => setDiagnosisName(e.target.value)}
                placeholder="Ej: Radiografía de tórax - Juan Pérez"
                className="diagnosis-name-input"
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="save-diagnosis-actions">
              <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <FaSave className="save-icon" /> Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SaveDiagnosisModal;
