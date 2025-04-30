import React, { useState, useEffect } from 'react';
import { getDiagnosisHistory, deleteDiagnosisFromHistory, getDiagnosisById } from '../services/storageService';
import { FaTrash, FaEye, FaCalendarAlt } from 'react-icons/fa';
import DiagnosisDetailsModal from '../components/DiagnosisDetailsModal';

function Historial() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar el historial al montar el componente
  useEffect(() => {
    loadHistory();
  }, []);

  // Función para cargar el historial
  const loadHistory = () => {
    setLoading(true);
    const history = getDiagnosisHistory();
    setHistoryItems(history);
    setLoading(false);
  };

  // Función para eliminar un diagnóstico
  const handleDelete = (id, e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que deseas eliminar este diagnóstico?')) {
      const deleted = deleteDiagnosisFromHistory(id);
      if (deleted) {
        loadHistory();
      } else {
        alert('Error al eliminar el diagnóstico');
      }
    }
  };

  // Función para ver los detalles de un diagnóstico
  const handleViewDetails = (id, e) => {
    e.preventDefault();
    const diagnosis = getDiagnosisById(id);
    if (diagnosis) {
      setSelectedDiagnosis(diagnosis);
      setShowModal(true);
    } else {
      alert('Error al cargar los detalles del diagnóstico');
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDiagnosis(null);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="historial-page">
      <div className="container">
        <h2 className="page-title">Historial de Análisis</h2>
        <p className="page-description">Consulta tus análisis anteriores</p>

        {loading ? (
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Cargando historial...
              </div>
            </div>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No hay diagnósticos guardados. Realiza un análisis y archívalo para verlo aquí.
              </div>
            </div>
          </div>
        ) : (
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="history-list">
                {historyItems.map((item) => (
                  <div className="history-item" key={item.id}>
                    <div className="history-date">
                      <FaCalendarAlt className="me-2" />
                      {formatDate(item.date)}
                    </div>
                    <div className="history-title">{item.title}</div>
                    <div className="history-actions">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={(e) => handleViewDetails(item.id, e)}
                      >
                        <FaEye className="me-1" /> Ver detalles
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => handleDelete(item.id, e)}
                      >
                        <FaTrash className="me-1" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles del diagnóstico */}
      {showModal && selectedDiagnosis && (
        <DiagnosisDetailsModal
          diagnosis={selectedDiagnosis}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Historial;
