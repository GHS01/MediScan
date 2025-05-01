import { useState, useEffect, useRef } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';

const ImageViewer = ({ images, activeIndex, onSelectImage }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const processedImages = useRef(new Set());

  // Crear URLs para las imágenes cuando cambian
  useEffect(() => {
    if (images.length === 0) return;

    let needsUpdate = false;
    const newUrls = { ...imageUrls };

    // Procesar todas las imágenes que no han sido procesadas
    images.forEach((image, index) => {
      // Crear un identificador único para cada imagen
      const imageId = image.name + '_' + image.size + '_' + image.lastModified;

      if (!processedImages.current.has(imageId)) {
        // Marcar esta imagen como procesada
        processedImages.current.add(imageId);

        // Crear URL para esta imagen
        newUrls[index] = URL.createObjectURL(image);
        needsUpdate = true;
      }
    });

    // Actualizar el estado solo si hay cambios
    if (needsUpdate) {
      setImageUrls(newUrls);
    }
  }, [images]);

  // Limpiar las URLs cuando el componente se desmonte
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (images.length === 0) {
    return (
      <div className="image-viewer-placeholder">
        <div className="placeholder-text">
          Visualizador de imágenes médicas
          <p className="placeholder-subtext">Las imágenes cargadas se mostrarán aquí para su análisis</p>
        </div>
      </div>
    );
  }

  // Si no tenemos la URL de la imagen activa, mostrar un placeholder
  if (!imageUrls[activeIndex]) {
    return (
      <div className="image-viewer">
        <div className="main-image-container">
          <div className="loading-placeholder">Cargando imagen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-viewer ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="main-image-container">
        <img
          src={imageUrls[activeIndex]}
          alt={`Imagen médica ${activeIndex + 1}`}
          className="main-image"
        />
        <button
          className="fullscreen-toggle"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
          title={fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
        >
          {fullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      <div className="image-info">
        <div className="image-info-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </svg>
          <span>Archivo: {images[activeIndex]?.name || 'Imagen médica'}</span>
        </div>
        <div className="image-info-detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
          </svg>
          <span>
            {images[activeIndex]?.source === 'laboratorio'
              ? 'Resultado de laboratorio'
              : 'Imagen médica'}
          </span>
        </div>
        {images[activeIndex]?.preprocessed && (
          <div className="image-info-detail preprocessing-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.663 3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h.163zm-4.5 1a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H5.663a.5.5 0 0 1-.5-.5v-7zm-2.5 2a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3.163a.5.5 0 0 1-.5-.5v-3zm8.5 0a.5.5 0 0 1 .5-.5h.163a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H11.663a.5.5 0 0 1-.5-.5v-3z"/>
            </svg>
            <span title="Imagen mejorada con algoritmos de preprocesamiento">Preprocesada</span>
          </div>
        )}
      </div>

      {images[activeIndex]?.preprocessed && (
        <div className="preprocessing-info">
          <div className="preprocessing-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
              <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            </svg>
            <span>Mejoras aplicadas</span>
          </div>
          <div className="preprocessing-steps">
            {images[activeIndex]?.preprocessingInfo?.steps?.normalize && (
              <div className="preprocessing-step">
                <span className="step-icon">✓</span>
                <span className="step-name">Normalización</span>
                <span className="step-description">Ajuste de brillo y contraste</span>
              </div>
            )}
            {images[activeIndex]?.preprocessingInfo?.steps?.reduceNoiseFilter && (
              <div className="preprocessing-step">
                <span className="step-icon">✓</span>
                <span className="step-name">Reducción de ruido</span>
                <span className="step-description">Filtrado para mejorar claridad</span>
              </div>
            )}
            {images[activeIndex]?.preprocessingInfo?.steps?.enhanceContrastFilter && (
              <div className="preprocessing-step">
                <span className="step-icon">✓</span>
                <span className="step-name">Mejora de contraste</span>
                <span className="step-description">Ecualización para destacar detalles</span>
              </div>
            )}
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div className="image-thumbnails">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
              onClick={() => onSelectImage(index)}
              title={image.source === 'laboratorio' ? 'Resultado de laboratorio' : 'Imagen médica'}
            >
              <div className="thumbnail-wrapper">
                {imageUrls[index] ? (
                  <>
                    <img
                      src={imageUrls[index]}
                      alt={`Miniatura ${index + 1}`}
                    />
                    <div
                      className={`thumbnail-badge ${image.source === 'laboratorio' ? 'badge-lab' : 'badge-med'}`}
                      title={image.source === 'laboratorio' ? 'Resultado de laboratorio' : 'Imagen médica'}
                    >
                      {image.source === 'laboratorio' ? 'Lab' : 'Med'}
                    </div>
                  </>
                ) : (
                  <div className="thumbnail-loading">Cargando...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
