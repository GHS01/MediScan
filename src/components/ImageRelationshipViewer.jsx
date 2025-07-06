/**
 * Visualizador de Relaciones entre Imágenes Médicas
 * Muestra visualmente las conexiones y contexto entre múltiples imágenes
 */

import React, { useState } from 'react';
import { IMAGE_RELATIONSHIPS } from '../utils/imageContextAnalyzer';

const ImageRelationshipViewer = ({ 
  images = [], 
  context = null, 
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // No mostrar si hay menos de 2 imágenes
  if (!images || images.length < 2 || !context) {
    return null;
  }

  // Obtener icono y color según el tipo de relación
  const getRelationshipStyle = (relationship) => {
    const styles = {
      [IMAGE_RELATIONSHIPS.SAME_STUDY]: {
        icon: '🔄',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        connectionColor: 'stroke-blue-500'
      },
      [IMAGE_RELATIONSHIPS.FOLLOW_UP]: {
        icon: '📅',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        connectionColor: 'stroke-green-500'
      },
      [IMAGE_RELATIONSHIPS.COMPARISON]: {
        icon: '⚖️',
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800',
        connectionColor: 'stroke-purple-500'
      },
      [IMAGE_RELATIONSHIPS.BILATERAL]: {
        icon: '↔️',
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        connectionColor: 'stroke-orange-500'
      },
      [IMAGE_RELATIONSHIPS.PROGRESSION]: {
        icon: '📈',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        connectionColor: 'stroke-red-500'
      }
    };

    return styles[relationship] || styles[IMAGE_RELATIONSHIPS.SAME_STUDY];
  };

  const relationshipStyle = getRelationshipStyle(context.relationship);

  // Generar miniatura de imagen
  const generateThumbnail = (image, index) => {
    const imageUrl = image.url || (image.file ? URL.createObjectURL(image.file) : null);
    
    return (
      <div
        key={index}
        className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
          selectedImage === index 
            ? `${relationshipStyle.borderColor} ${relationshipStyle.bgColor}` 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedImage(selectedImage === index ? null : index)}
      >
        <div className="aspect-square w-20 h-20 bg-gray-100 rounded overflow-hidden mb-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Imagen médica ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              🏥
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs font-medium text-gray-700">
            Imagen {index + 1}
          </p>
          {image.name && (
            <p className="text-xs text-gray-500 truncate" title={image.name}>
              {image.name.length > 12 ? `${image.name.substring(0, 12)}...` : image.name}
            </p>
          )}
        </div>

        {/* Indicador de selección */}
        {selectedImage === index && (
          <div className={`absolute -top-1 -right-1 w-6 h-6 ${relationshipStyle.bgColor} ${relationshipStyle.borderColor} border-2 rounded-full flex items-center justify-center`}>
            <span className="text-xs">✓</span>
          </div>
        )}
      </div>
    );
  };

  // Generar líneas de conexión SVG
  const generateConnections = () => {
    if (images.length < 2) return null;

    const connections = [];
    const centerX = 150;
    const centerY = 100;
    const radius = 80;

    // Calcular posiciones de las imágenes en círculo
    const positions = images.map((_, index) => {
      const angle = (index * 2 * Math.PI) / images.length - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Generar conexiones según el tipo de relación
    if (context.relationship === IMAGE_RELATIONSHIPS.SAME_STUDY) {
      // Conectar todas las imágenes al centro
      positions.forEach((pos, index) => {
        connections.push(
          <line
            key={`center-${index}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            className={relationshipStyle.connectionColor}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      });
    } else if (context.relationship === IMAGE_RELATIONSHIPS.FOLLOW_UP) {
      // Conectar en secuencia temporal
      for (let i = 0; i < positions.length - 1; i++) {
        connections.push(
          <line
            key={`seq-${i}`}
            x1={positions[i].x}
            y1={positions[i].y}
            x2={positions[i + 1].x}
            y2={positions[i + 1].y}
            className={relationshipStyle.connectionColor}
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
        );
      }
    } else if (context.relationship === IMAGE_RELATIONSHIPS.COMPARISON) {
      // Conectar todas con todas
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          connections.push(
            <line
              key={`comp-${i}-${j}`}
              x1={positions[i].x}
              y1={positions[i].y}
              x2={positions[j].x}
              y2={positions[j].y}
              className={relationshipStyle.connectionColor}
              strokeWidth="1"
              opacity="0.6"
            />
          );
        }
      }
    }

    return (
      <svg width="300" height="200" className="absolute inset-0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className={relationshipStyle.connectionColor}
              fill="currentColor"
            />
          </marker>
        </defs>
        {connections}
        
        {/* Punto central para mismo estudio */}
        {context.relationship === IMAGE_RELATIONSHIPS.SAME_STUDY && (
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            className={`${relationshipStyle.connectionColor} fill-current`}
          />
        )}
      </svg>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {relationshipStyle.icon} Relación entre Imágenes
        </h3>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showDetails ? '▼' : '▶'} Detalles
        </button>
      </div>

      {/* Visualización principal */}
      <div className="mb-4">
        <div className={`${relationshipStyle.bgColor} ${relationshipStyle.borderColor} border rounded-lg p-4`}>
          <div className="flex items-center justify-center mb-3">
            <span className={`text-lg font-medium ${relationshipStyle.textColor}`}>
              {context.relationship === IMAGE_RELATIONSHIPS.SAME_STUDY && 'Mismo Estudio - Múltiples Vistas'}
              {context.relationship === IMAGE_RELATIONSHIPS.FOLLOW_UP && 'Seguimiento Temporal'}
              {context.relationship === IMAGE_RELATIONSHIPS.COMPARISON && 'Comparación Diagnóstica'}
              {context.relationship === IMAGE_RELATIONSHIPS.BILATERAL && 'Comparación Bilateral'}
              {context.relationship === IMAGE_RELATIONSHIPS.PROGRESSION && 'Progresión de Enfermedad'}
            </span>
          </div>

          {/* Diagrama de conexiones */}
          <div className="relative h-48 mb-4">
            {generateConnections()}
            
            {/* Posicionar miniaturas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {images.map((image, index) => {
                  const angle = (index * 2 * Math.PI) / images.length - Math.PI / 2;
                  const radius = 80;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  
                  return (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${150 + x}px`,
                        top: `${100 + y}px`
                      }}
                    >
                      <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        {image.url || image.file ? (
                          <img
                            src={image.url || URL.createObjectURL(image.file)}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Descripción del contexto */}
          <div className={`text-center ${relationshipStyle.textColor}`}>
            <p className="text-sm">
              {context.relationship === IMAGE_RELATIONSHIPS.SAME_STUDY && 
                'Las imágenes serán analizadas como vistas complementarias del mismo estudio para diagnóstico integral.'}
              {context.relationship === IMAGE_RELATIONSHIPS.FOLLOW_UP && 
                'Las imágenes serán comparadas temporalmente para evaluar evolución y cambios.'}
              {context.relationship === IMAGE_RELATIONSHIPS.COMPARISON && 
                'Las imágenes serán comparadas para identificar diferencias diagnósticas significativas.'}
              {context.relationship === IMAGE_RELATIONSHIPS.BILATERAL && 
                'Las imágenes serán comparadas para evaluar simetría y diferencias bilaterales.'}
              {context.relationship === IMAGE_RELATIONSHIPS.PROGRESSION && 
                'Las imágenes serán analizadas para documentar progresión de enfermedad.'}
            </p>
          </div>
        </div>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((image, index) => generateThumbnail(image, index))}
          </div>

          {/* Información del contexto */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-800 mb-2">Información del Contexto:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Confianza:</span>
                <span className="ml-2">{Math.round((context.confidence || 0) * 100)}%</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Región anatómica:</span>
                <span className="ml-2">{context.anatomicalRegion || 'No determinada'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tipo de estudio:</span>
                <span className="ml-2">{context.studyType || 'No determinado'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Vistas:</span>
                <span className="ml-2">{context.views?.join(', ') || 'No determinadas'}</span>
              </div>
            </div>

            {context.recommendations && context.recommendations.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-gray-600">Recomendaciones:</span>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                  {context.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Imagen seleccionada */}
          {selectedImage !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">
                Imagen {selectedImage + 1} seleccionada:
              </h4>
              <div className="text-sm text-blue-700">
                <p><strong>Nombre:</strong> {images[selectedImage]?.name || 'Sin nombre'}</p>
                <p><strong>Tamaño:</strong> {images[selectedImage]?.size ? `${Math.round(images[selectedImage].size / 1024)} KB` : 'Desconocido'}</p>
                <p><strong>Tipo:</strong> {images[selectedImage]?.type || 'Desconocido'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageRelationshipViewer;
