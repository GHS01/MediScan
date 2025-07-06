/**
 * Selector de Contexto de Imágenes Médicas
 * Permite a los usuarios especificar la relación entre múltiples imágenes cargadas
 */

import React, { useState, useEffect } from 'react';
import { IMAGE_RELATIONSHIPS, getContextDescription } from '../utils/imageContextAnalyzer';

const ImageContextSelector = ({ 
  images = [], 
  detectedContext = null, 
  onContextChange = () => {},
  className = '' 
}) => {
  const [selectedContext, setSelectedContext] = useState(IMAGE_RELATIONSHIPS.UNKNOWN);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confidence, setConfidence] = useState(0);

  // Actualizar contexto cuando se detecta automáticamente
  useEffect(() => {
    if (detectedContext) {
      setSelectedContext(detectedContext.relationship);
      setConfidence(detectedContext.confidence);
      onContextChange(detectedContext);
    }
  }, [detectedContext, onContextChange]);

  // Manejar cambio de contexto manual
  const handleContextChange = (newContext) => {
    setSelectedContext(newContext);
    
    const updatedContext = {
      ...detectedContext,
      relationship: newContext,
      confidence: newContext === detectedContext?.relationship ? detectedContext.confidence : 0.5,
      manuallySet: true
    };
    
    onContextChange(updatedContext);
  };

  // Opciones de contexto con descripciones
  const contextOptions = [
    {
      value: IMAGE_RELATIONSHIPS.SAME_STUDY,
      label: 'Mismo Estudio',
      description: 'Múltiples vistas del mismo examen (ej: frontal y lateral)',
      icon: '🔄',
      recommended: detectedContext?.relationship === IMAGE_RELATIONSHIPS.SAME_STUDY
    },
    {
      value: IMAGE_RELATIONSHIPS.FOLLOW_UP,
      label: 'Seguimiento',
      description: 'Estudios de diferentes fechas para evaluar evolución',
      icon: '📅',
      recommended: detectedContext?.relationship === IMAGE_RELATIONSHIPS.FOLLOW_UP
    },
    {
      value: IMAGE_RELATIONSHIPS.COMPARISON,
      label: 'Comparación',
      description: 'Comparar diferentes casos o condiciones',
      icon: '⚖️',
      recommended: detectedContext?.relationship === IMAGE_RELATIONSHIPS.COMPARISON
    },
    {
      value: IMAGE_RELATIONSHIPS.BILATERAL,
      label: 'Bilateral',
      description: 'Comparación entre lado derecho e izquierdo',
      icon: '↔️',
      recommended: detectedContext?.relationship === IMAGE_RELATIONSHIPS.BILATERAL
    }
  ];

  // No mostrar si hay menos de 2 imágenes
  if (!images || images.length < 2) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          🧠 Contexto de Análisis
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({images.length} imágenes)
          </span>
        </h3>
        
        {detectedContext && (
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              Auto-detectado
            </span>
            <div className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {Math.round(confidence * 100)}% confianza
            </div>
          </div>
        )}
      </div>

      {/* Contexto detectado automáticamente */}
      {detectedContext && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 font-medium">🤖 Detección Automática:</span>
          </div>
          <p className="text-sm text-blue-800">
            {getContextDescription(detectedContext)}
          </p>
          {detectedContext.recommendations && detectedContext.recommendations.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-blue-600 font-medium">Recomendaciones:</p>
              <ul className="text-xs text-blue-700 list-disc list-inside">
                {detectedContext.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Selector de contexto */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especifica la relación entre las imágenes:
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contextOptions.map((option) => (
            <div
              key={option.value}
              className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                selectedContext === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${option.recommended ? 'ring-2 ring-green-200' : ''}`}
              onClick={() => handleContextChange(option.value)}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  name="imageContext"
                  value={option.value}
                  checked={selectedContext === option.value}
                  onChange={() => handleContextChange(option.value)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">{option.icon}</span>
                    <span className="font-medium text-gray-800">
                      {option.label}
                    </span>
                    {option.recommended && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opciones avanzadas */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showAdvanced ? '▼' : '▶'} Opciones avanzadas
        </button>
        
        {showAdvanced && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contexto personalizado:
                </label>
                <select
                  value={selectedContext}
                  onChange={(e) => handleContextChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={IMAGE_RELATIONSHIPS.UNKNOWN}>Sin especificar</option>
                  <option value={IMAGE_RELATIONSHIPS.PROGRESSION}>Progresión de enfermedad</option>
                  <option value="pre_post_treatment">Pre/Post tratamiento</option>
                  <option value="different_modalities">Diferentes modalidades</option>
                  <option value="teaching_case">Caso educativo</option>
                </select>
              </div>
              
              {detectedContext && (
                <div className="text-xs text-gray-600">
                  <p><strong>Región anatómica detectada:</strong> {detectedContext.anatomicalRegion || 'No determinada'}</p>
                  <p><strong>Vistas detectadas:</strong> {detectedContext.views.join(', ') || 'No determinadas'}</p>
                  <p><strong>Tipo de estudio:</strong> {detectedContext.studyType || 'No determinado'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información de ayuda */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">💡</span>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">¿Por qué es importante especificar el contexto?</p>
            <p>
              El contexto ayuda a la IA a proporcionar un análisis más preciso y relevante. 
              Por ejemplo, para múltiples vistas del mismo estudio, la IA correlacionará 
              hallazgos entre las imágenes para un diagnóstico más completo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageContextSelector;
