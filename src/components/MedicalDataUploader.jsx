import { useState } from 'react';
import {
  FaUpload,
  FaImage,
  FaSpinner,
  FaFileImage,
  FaFileUpload,
  FaFileMedical,
  FaFileAlt,
  FaFilePrescription,
  FaFileInvoice,
  FaUserMd,
  FaNotesMedical,
  FaVial,
  FaFilePdf,
  FaFileWord,
  FaPlus,
  FaTimes
} from 'react-icons/fa';

const MedicalDataUploader = ({ onDataUpload, isLoading }) => {
  const [activeTab, setActiveTab] = useState('imagenes');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    imagenes: [],
    historial: null,
    sintomas: '',
    laboratorio: []
  });
  const [patientInfo, setPatientInfo] = useState({
    nombre: '',
    edad: '',
    genero: '',
    antecedentes: ''
  });

  // Tipos de imágenes médicas
  const imageTypes = [
    { id: 'radiografia', name: 'Radiografía', icon: <FaFileImage /> },
    { id: 'tomografia', name: 'Tomografía', icon: <FaFileMedical /> },
    { id: 'ecografia', name: 'Ecografía', icon: <FaFileAlt /> },
    { id: 'resonancia', name: 'Resonancia Magnética', icon: <FaFilePrescription /> }
  ];

  // Función para manejar el arrastre de archivos
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Función para manejar la soltura de archivos
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files, activeTab);
    }
  };

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files, activeTab);
    }
  };

  // Función para procesar los archivos según el tipo
  const handleFiles = (files, type) => {
    if (type === 'imagenes') {
      // Filtrar solo archivos de imagen
      const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );

      if (imageFiles.length > 0) {
        setSelectedFiles(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, ...imageFiles]
        }));
      }
    } else if (type === 'historial') {
      // Para historial médico, solo permitimos un archivo
      const file = files[0];
      if (file && (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document'))) {
        setSelectedFiles(prev => ({
          ...prev,
          historial: file
        }));
      }
    } else if (type === 'laboratorio') {
      // Para resultados de laboratorio, permitimos múltiples archivos
      const labFiles = Array.from(files).filter(file =>
        file.type.includes('pdf') ||
        file.type.includes('image/') ||
        file.type.includes('word') ||
        file.type.includes('document') ||
        file.type.includes('spreadsheet') ||
        file.type.includes('excel')
      );

      if (labFiles.length > 0) {
        setSelectedFiles(prev => ({
          ...prev,
          laboratorio: [...prev.laboratorio, ...labFiles]
        }));
      }
    }
  };

  // Función para manejar cambios en los campos de texto
  const handleTextChange = (e) => {
    const { name, value } = e.target;

    if (name === 'sintomas') {
      setSelectedFiles(prev => ({
        ...prev,
        sintomas: value
      }));
    } else {
      setPatientInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Función para eliminar un archivo
  const removeFile = (type, index) => {
    if (type === 'imagenes') {
      setSelectedFiles(prev => ({
        ...prev,
        imagenes: prev.imagenes.filter((_, i) => i !== index)
      }));
    } else if (type === 'historial') {
      setSelectedFiles(prev => ({
        ...prev,
        historial: null
      }));
    } else if (type === 'laboratorio') {
      setSelectedFiles(prev => ({
        ...prev,
        laboratorio: prev.laboratorio.filter((_, i) => i !== index)
      }));
    }
  };

  // Función para enviar todos los datos
  const handleSubmit = () => {
    // Recopilar todos los datos
    const allData = {
      imagenes: selectedFiles.imagenes,
      historial: selectedFiles.historial,
      sintomas: selectedFiles.sintomas,
      laboratorio: selectedFiles.laboratorio,
      paciente: patientInfo
    };

    // Llamar a la función de carga proporcionada por el componente padre
    onDataUpload(allData);
  };

  // Verificar si hay datos para enviar
  const hasData = () => {
    return (
      selectedFiles.imagenes.length > 0 ||
      selectedFiles.historial ||
      selectedFiles.sintomas.trim() !== '' ||
      selectedFiles.laboratorio.length > 0
    );
  };

  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'imagenes':
        return (
          <div
            className={`upload-area ${dragActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="file-input"
              multiple
            />
            <label htmlFor="image-upload" className="upload-label">
              {isLoading ? (
                <>
                  <div className="upload-icon">
                    <FaSpinner size={48} className="spinner" />
                  </div>
                  <div className="upload-text">
                    Procesando imágenes...
                  </div>
                  <div className="upload-hint">
                    Esto puede tardar unos segundos
                  </div>
                  <div className="upload-progress">
                    <div className="progress-bar"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="upload-icon">
                    {dragActive ? <FaFileImage size={48} /> : <FaFileUpload size={48} />}
                  </div>
                  <div className="upload-text">
                    {dragActive
                      ? 'Suelta las imágenes aquí'
                      : selectedFiles.imagenes.length > 0
                        ? `${selectedFiles.imagenes.length} imágenes seleccionadas`
                        : 'Arrastra y suelta imágenes médicas o haz clic para seleccionar'}
                  </div>
                  <div className="upload-hint">
                    Formatos aceptados: JPG, PNG, WEBP (máx. 4MB por archivo)
                  </div>
                  <div className="preprocessing-hint">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M9.663 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h.163zm-4.5 1a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H5.663a.5.5 0 0 1-.5-.5v-7zm-2.5 2a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3.163a.5.5 0 0 1-.5-.5v-3zm8.5 0a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H11.663a.5.5 0 0 1-.5-.5v-3z"/>
                    </svg>
                    Las imágenes serán preprocesadas para mejorar el análisis
                  </div>
                  {selectedFiles.imagenes.length === 0 && (
                    <button className="upload-button">
                      Seleccionar archivos
                    </button>
                  )}
                </>
              )}
            </label>

            {selectedFiles.imagenes.length > 0 && (
              <div className="selected-files">
                <h4>Imágenes seleccionadas</h4>
                <div className="file-list">
                  {selectedFiles.imagenes.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        <FaImage />
                      </div>
                      <div className="file-name">{file.name}</div>
                      <button
                        className="file-remove"
                        onClick={() => removeFile('imagenes', index)}
                        disabled={isLoading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="image-types">
                  <h5>Tipo de imagen:</h5>
                  <div className="image-type-options">
                    {imageTypes.map(type => (
                      <div key={type.id} className="image-type-option">
                        <input
                          type="radio"
                          id={type.id}
                          name="imageType"
                          value={type.id}
                        />
                        <label htmlFor={type.id}>
                          {type.icon} {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'historial':
        return (
          <div className="medical-history-section">
            <div className="row">
              <div className="col-md-6">
                <div className="patient-info">
                  <h4>Información del paciente</h4>

                  {/* Mensaje informativo sobre la contextualización */}
                  <div className="context-info-box">
                    <div className="context-info-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                    </div>
                    <div className="context-info-text">
                      <p>La información del paciente mejora significativamente la precisión del análisis de IA al proporcionar contexto clínico relevante.</p>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="nombre">Nombre del paciente</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={patientInfo.nombre}
                      onChange={handleTextChange}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="edad">Edad</label>
                        <input
                          type="number"
                          className="form-control"
                          id="edad"
                          name="edad"
                          value={patientInfo.edad}
                          onChange={handleTextChange}
                          placeholder="Edad"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="genero">Género</label>
                        <select
                          className="form-select"
                          id="genero"
                          name="genero"
                          value={patientInfo.genero}
                          onChange={handleTextChange}
                        >
                          <option value="">Seleccionar</option>
                          <option value="masculino">Masculino</option>
                          <option value="femenino">Femenino</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="antecedentes">
                      Antecedentes médicos
                      <span className="field-enhancement-badge">Procesamiento avanzado</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="antecedentes"
                      name="antecedentes"
                      value={patientInfo.antecedentes}
                      onChange={handleTextChange}
                      rows="4"
                      placeholder="Describa condiciones crónicas, cirugías previas, alergias y medicación actual"
                    ></textarea>
                    <small className="form-text text-muted">
                      El sistema identificará automáticamente condiciones crónicas, cirugías previas, alergias y medicación actual para un análisis más preciso.
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`upload-area history-upload ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="history-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="file-input"
                  />
                  <label htmlFor="history-upload" className="upload-label">
                    <div className="upload-icon">
                      <FaFileMedical size={48} />
                    </div>
                    <div className="upload-text">
                      {selectedFiles.historial
                        ? `Archivo seleccionado: ${selectedFiles.historial.name}`
                        : 'Cargar historial médico (opcional)'}
                    </div>
                    <div className="upload-hint">
                      Formatos aceptados: PDF, DOC, DOCX, TXT
                    </div>
                    <div className="context-feature-hint">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.663 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h.163zm-4.5 1a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H5.663a.5.5 0 0 1-.5-.5v-7zm-2.5 2a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3.163a.5.5 0 0 1-.5-.5v-3zm8.5 0a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H11.663a.5.5 0 0 1-.5-.5v-3z"/>
                      </svg>
                      <span>El sistema extraerá información relevante para contextualizar el análisis</span>
                    </div>
                    {!selectedFiles.historial && (
                      <button className="upload-button">
                        Seleccionar archivo
                      </button>
                    )}
                  </label>

                  {selectedFiles.historial && (
                    <div className="selected-files mt-3">
                      <div className="file-item">
                        <div className="file-icon">
                          {selectedFiles.historial.type.includes('pdf') ? <FaFilePdf /> : <FaFileWord />}
                        </div>
                        <div className="file-name">{selectedFiles.historial.name}</div>
                        <button
                          className="file-remove"
                          onClick={() => removeFile('historial')}
                          disabled={isLoading}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sintomas':
        return (
          <div className="symptoms-section">
            {/* Mensaje informativo sobre la contextualización */}
            <div className="context-info-box">
              <div className="context-info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </div>
              <div className="context-info-text">
                <p>La descripción detallada de síntomas permite a la IA correlacionar hallazgos visuales con manifestaciones clínicas, mejorando la precisión diagnóstica.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sintomas">
                Describa los síntomas o motivo de consulta
                <span className="field-enhancement-badge">Procesamiento avanzado</span>
              </label>
              <textarea
                className="form-control"
                id="sintomas"
                name="sintomas"
                value={selectedFiles.sintomas}
                onChange={handleTextChange}
                rows="8"
                placeholder="Describa detalladamente los síntomas, cuándo comenzaron, su intensidad, factores que los agravan o alivian, etc."
              ></textarea>
              <small className="form-text text-muted">
                El sistema analizará automáticamente la duración, severidad y patrones de los síntomas para mejorar el análisis.
              </small>
            </div>
            <div className="symptoms-tips">
              <h5>Consejos para una mejor descripción:</h5>
              <ul>
                <li>Mencione <strong>cuándo comenzaron</strong> los síntomas (ej. "hace 2 semanas")</li>
                <li>Describa la <strong>intensidad</strong> (leve, moderada, severa) y <strong>frecuencia</strong></li>
                <li>Indique si hay <strong>factores que empeoran</strong> (ej. "empeora al caminar") o <strong>mejoran</strong> los síntomas</li>
                <li>Mencione <strong>tratamientos previos</strong> y su efectividad</li>
                <li>Incluya <strong>síntomas asociados</strong> que puedan estar relacionados</li>
              </ul>
            </div>
          </div>
        );

      case 'laboratorio':
        return (
          <div className="lab-results-section">
            {/* Mensaje informativo sobre la contextualización */}
            <div className="context-info-box">
              <div className="context-info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </div>
              <div className="context-info-text">
                <p>Los resultados de laboratorio proporcionan datos objetivos que complementan los hallazgos visuales, permitiendo un análisis más completo y preciso.</p>
              </div>
            </div>

            <div
              className={`upload-area lab-upload ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
            <input
              type="file"
              id="lab-upload"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={isLoading}
              className="file-input"
              multiple
            />
            <label htmlFor="lab-upload" className="upload-label">
              <div className="upload-icon">
                <FaVial size={48} />
              </div>
              <div className="upload-text">
                {dragActive
                  ? 'Suelta los archivos aquí'
                  : selectedFiles.laboratorio.length > 0
                    ? `${selectedFiles.laboratorio.length} archivos seleccionados`
                    : 'Cargar resultados de laboratorio (opcional)'}
              </div>
              <div className="upload-hint">
                Formatos aceptados: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
              </div>
              <div className="context-feature-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.663 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h.163zm-4.5 1a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H5.663a.5.5 0 0 1-.5-.5v-7zm-2.5 2a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3.163a.5.5 0 0 1-.5-.5v-3zm8.5 0a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H11.663a.5.5 0 0 1-.5-.5v-3z"/>
                </svg>
                <span>Los valores de laboratorio serán procesados para contextualizar el análisis de imágenes</span>
              </div>
              {selectedFiles.laboratorio.length === 0 && (
                <button className="upload-button">
                  Seleccionar archivos
                </button>
              )}
            </label>

            {selectedFiles.laboratorio.length > 0 && (
              <div className="selected-files">
                <h4>Archivos seleccionados</h4>
                <div className="file-list">
                  {selectedFiles.laboratorio.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        {file.type.includes('pdf') ? <FaFilePdf /> :
                         file.type.includes('image') ? <FaImage /> :
                         file.type.includes('word') ? <FaFileWord /> :
                         <FaFileAlt />}
                      </div>
                      <div className="file-name">{file.name}</div>
                      <button
                        className="file-remove"
                        onClick={() => removeFile('laboratorio', index)}
                        disabled={isLoading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="medical-data-uploader">
      <div className="uploader-header">
        <h2 className="uploader-title">Análisis médico completo</h2>
        <p className="uploader-subtitle">Proporcione información médica para un análisis más preciso</p>
      </div>

      <div className="uploader-tabs">
        <div
          className={`uploader-tab ${activeTab === 'imagenes' ? 'active' : ''}`}
          onClick={() => setActiveTab('imagenes')}
        >
          <FaImage /> Imágenes médicas
        </div>
        <div
          className={`uploader-tab ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          <FaUserMd /> Historial del paciente
        </div>
        <div
          className={`uploader-tab ${activeTab === 'sintomas' ? 'active' : ''}`}
          onClick={() => setActiveTab('sintomas')}
        >
          <FaNotesMedical /> Síntomas y observaciones
        </div>
        <div
          className={`uploader-tab ${activeTab === 'laboratorio' ? 'active' : ''}`}
          onClick={() => setActiveTab('laboratorio')}
        >
          <FaVial /> Resultados de laboratorio
        </div>
      </div>

      <div className="uploader-content">
        {renderTabContent()}
      </div>

      <div className="uploader-actions">
        <button
          className="btn btn-primary btn-lg submit-button"
          onClick={handleSubmit}
          disabled={!hasData() || isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner me-2" />
              Procesando...
            </>
          ) : (
            <>
              Analizar información
            </>
          )}
        </button>
      </div>

      <div className="uploader-footer">
        <div className="uploader-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </svg>
          <span>Toda la información se procesa de forma segura y privada</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalDataUploader;
