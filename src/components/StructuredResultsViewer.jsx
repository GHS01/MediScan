/**
 * Visualizador de Resultados Estructurados
 * Muestra análisis individual, correlación y diagnóstico integral para múltiples imágenes
 */

import React, { useState } from 'react';
import { IMAGE_RELATIONSHIPS } from '../utils/imageContextAnalyzer';

const StructuredResultsViewer = ({ 
  analysisResult = '', 
  imageContext = null, 
  images = [], 
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState('integral');
  const [expandedImage, setExpandedImage] = useState(null);

  // Parsear el resultado del análisis para extraer secciones estructuradas
  const parseAnalysisResult = (result) => {
    if (!result || typeof result !== 'string') {
      return {
        integral: result || 'No hay análisis disponible',
        individual: [],
        correlation: '',
        recommendations: ''
      };
    }

    const sections = {
      integral: '',
      individual: [],
      correlation: '',
      recommendations: ''
    };

    // Dividir por secciones usando marcadores comunes
    const lines = result.split('\n');
    let currentSection = 'integral';
    let currentContent = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      // Detectar secciones
      if (lowerLine.includes('análisis por vista') || 
          lowerLine.includes('análisis individual') ||
          lowerLine.includes('análisis por imagen')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'individual';
        currentContent = [];
      } else if (lowerLine.includes('correlación') || 
                 lowerLine.includes('comparación temporal') ||
                 lowerLine.includes('comparación sistemática')) {
        if (currentContent.length > 0) {
          if (currentSection === 'individual') {
            sections.individual = parseIndividualAnalysis(currentContent.join('\n'));
          } else {
            sections[currentSection] = currentContent.join('\n').trim();
          }
        }
        currentSection = 'correlation';
        currentContent = [];
      } else if (lowerLine.includes('recomendaciones') || 
                 lowerLine.includes('conclusiones') ||
                 lowerLine.includes('diagnóstico integral') ||
                 lowerLine.includes('diagnóstico final')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = 'recommendations';
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Agregar el último contenido
    if (currentContent.length > 0) {
      if (currentSection === 'individual') {
        sections.individual = parseIndividualAnalysis(currentContent.join('\n'));
      } else {
        sections[currentSection] = currentContent.join('\n').trim();
      }
    }

    // Si no se detectaron secciones específicas, usar todo como integral
    if (!sections.individual.length && !sections.correlation && !sections.recommendations) {
      sections.integral = result;
    }

    return sections;
  };

  // Parsear análisis individual por imagen
  const parseIndividualAnalysis = (content) => {
    const analyses = [];
    const imagePatterns = [
      /imagen\s+(\d+)/gi,
      /vista\s+(\d+)/gi,
      /estudio\s+(\d+)/gi
    ];

    let currentAnalysis = { index: 0, content: '' };
    const lines = content.split('\n');

    for (const line of lines) {
      let foundImageIndex = null;
      
      // Buscar indicadores de nueva imagen
      for (const pattern of imagePatterns) {
        const match = line.match(pattern);
        if (match) {
          const index = parseInt(match[1]) - 1; // Convertir a índice base 0
          if (index >= 0) {
            foundImageIndex = index;
            break;
          }
        }
      }

      if (foundImageIndex !== null) {
        // Guardar análisis anterior si existe
        if (currentAnalysis.content.trim()) {
          analyses.push({ ...currentAnalysis });
        }
        // Iniciar nuevo análisis
        currentAnalysis = { index: foundImageIndex, content: line + '\n' };
      } else {
        currentAnalysis.content += line + '\n';
      }
    }

    // Agregar el último análisis
    if (currentAnalysis.content.trim()) {
      analyses.push(currentAnalysis);
    }

    // Si no se encontraron análisis individuales, dividir por párrafos
    if (analyses.length === 0 && images.length > 1) {
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      paragraphs.forEach((paragraph, index) => {
        if (index < images.length) {
          analyses.push({ index, content: paragraph });
        }
      });
    }

    return analyses;
  };

  const parsedResult = parseAnalysisResult(analysisResult);

  // Obtener icono según el tipo de relación
  const getRelationshipIcon = () => {
    if (!imageContext) return '🔍';
    
    const icons = {
      [IMAGE_RELATIONSHIPS.SAME_STUDY]: '🔄',
      [IMAGE_RELATIONSHIPS.FOLLOW_UP]: '📅',
      [IMAGE_RELATIONSHIPS.COMPARISON]: '⚖️',
      [IMAGE_RELATIONSHIPS.BILATERAL]: '↔️',
      [IMAGE_RELATIONSHIPS.PROGRESSION]: '📈'
    };
    
    return icons[imageContext.relationship] || '🔍';
  };

  // Secciones de navegación
  const sections = [
    {
      id: 'integral',
      label: 'Diagnóstico Integral',
      icon: '🎯',
      description: 'Análisis completo y conclusiones'
    },
    {
      id: 'individual',
      label: 'Análisis Individual',
      icon: '🔍',
      description: 'Análisis detallado por imagen',
      count: parsedResult.individual.length
    },
    {
      id: 'correlation',
      label: 'Correlación',
      icon: getRelationshipIcon(),
      description: 'Correlación entre imágenes'
    },
    {
      id: 'recommendations',
      label: 'Recomendaciones',
      icon: '💡',
      description: 'Sugerencias y próximos pasos'
    }
  ];

  // Renderizar contenido de sección
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'integral':
        return (
          <div className="prose max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-blue-800 font-semibold mb-2 flex items-center">
                🎯 Diagnóstico Integral
              </h3>
              <p className="text-blue-700 text-sm">
                Análisis completo basado en {images.length} imagen{images.length > 1 ? 'es' : ''} 
                {imageContext && ` con contexto: ${imageContext.relationship}`}
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-800">
              {parsedResult.integral || parsedResult.recommendations || analysisResult}
            </div>
          </div>
        );

      case 'individual':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2 flex items-center">
                🔍 Análisis Individual por Imagen
              </h3>
              <p className="text-green-700 text-sm">
                Análisis detallado de cada imagen por separado
              </p>
            </div>

            {parsedResult.individual.length > 0 ? (
              <div className="grid gap-4">
                {parsedResult.individual.map((analysis, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      expandedImage === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExpandedImage(expandedImage === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <span className="mr-2">📷</span>
                        Imagen {analysis.index + 1}
                        {images[analysis.index]?.name && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({images[analysis.index].name})
                          </span>
                        )}
                      </h4>
                      <span className="text-gray-400">
                        {expandedImage === index ? '▼' : '▶'}
                      </span>
                    </div>
                    
                    {expandedImage === index && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="whitespace-pre-wrap text-gray-700 text-sm">
                          {analysis.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se detectaron análisis individuales separados.</p>
                <p className="text-sm mt-2">
                  El análisis se encuentra en la sección "Diagnóstico Integral".
                </p>
              </div>
            )}
          </div>
        );

      case 'correlation':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-purple-800 font-semibold mb-2 flex items-center">
                {getRelationshipIcon()} Correlación entre Imágenes
              </h3>
              <p className="text-purple-700 text-sm">
                {imageContext && `Tipo de relación: ${imageContext.relationship}`}
                {images.length > 1 && ` • ${images.length} imágenes correlacionadas`}
              </p>
            </div>

            {parsedResult.correlation ? (
              <div className="whitespace-pre-wrap text-gray-800">
                {parsedResult.correlation}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se detectó sección de correlación específica.</p>
                <p className="text-sm mt-2">
                  La correlación puede estar incluida en el diagnóstico integral.
                </p>
              </div>
            )}
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold mb-2 flex items-center">
                💡 Recomendaciones y Próximos Pasos
              </h3>
              <p className="text-yellow-700 text-sm">
                Sugerencias basadas en los hallazgos del análisis
              </p>
            </div>

            {parsedResult.recommendations ? (
              <div className="whitespace-pre-wrap text-gray-800">
                {parsedResult.recommendations}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se detectaron recomendaciones específicas.</p>
                <p className="text-sm mt-2">
                  Las recomendaciones pueden estar incluidas en otras secciones.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // No mostrar si no hay resultado de análisis
  if (!analysisResult) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Navegación de secciones */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 p-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title={section.description}
            >
              <span className="mr-1">{section.icon}</span>
              {section.label}
              {section.count !== undefined && (
                <span className="ml-1 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la sección */}
      <div className="p-6">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default StructuredResultsViewer;
