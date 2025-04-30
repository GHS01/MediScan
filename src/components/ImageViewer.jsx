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

        <div className="image-controls">
          {/* Estos botones son decorativos por ahora, pero podrían implementarse en el futuro */}
          <button className="image-control-button" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            </svg>
          </button>
          <button className="image-control-button" title="Ajustar Contraste">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0z"/>
            </svg>
          </button>
          <button className="image-control-button" title="Rotar Imagen">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
        </div>
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
      </div>

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
