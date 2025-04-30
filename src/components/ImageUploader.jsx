import { useState } from 'react';
import { FaUpload, FaImage, FaSpinner, FaFileImage, FaFileUpload } from 'react-icons/fa';

const ImageUploader = ({ onImageUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onImageUpload(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onImageUpload(file);
    }
  };

  return (
    <div className="image-uploader-container">
      <div className="uploader-header">
        <h2 className="uploader-title">Carga tu radiografía</h2>
        <p className="uploader-subtitle">Sube tu imagen para obtener un análisis detallado</p>
      </div>

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
          onChange={handleChange}
          disabled={isLoading}
          className="file-input"
        />
        <label htmlFor="image-upload" className="upload-label">
          {isLoading ? (
            <>
              <div className="upload-icon">
                <FaSpinner size={48} className="spinner" />
              </div>
              <div className="upload-text">
                Procesando imagen...
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
                  ? 'Suelta la imagen aquí'
                  : selectedFile
                    ? `Archivo seleccionado: ${selectedFile.name}`
                    : 'Arrastra y suelta una radiografía o haz clic para seleccionar'}
              </div>
              <div className="upload-hint">
                Formatos aceptados: JPG, PNG, WEBP (máx. 4MB)
              </div>
              {!selectedFile && (
                <button className="upload-button">
                  Seleccionar archivo
                </button>
              )}
            </>
          )}
        </label>
      </div>

      <div className="uploader-footer">
        <div className="uploader-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </svg>
          <span>Tus imágenes se analizan de forma segura y privada</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
