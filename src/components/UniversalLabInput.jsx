/**
 * Entrada Universal de Valores de Laboratorio
 * Interfaz inteligente para captura manual de cualquier tipo de análisis
 */

import React, { useState, useEffect } from 'react';
import { LAB_CATEGORIES } from '../utils/universalLabAnalyzer';

const UniversalLabInput = ({ onLabValuesChange, patientData = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [labValues, setLabValues] = useState({});
  const [customParameters, setCustomParameters] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Actualizar valores cuando cambian
  useEffect(() => {
    onLabValuesChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      values: labValues,
      customParameters: customParameters
    });
  }, [selectedCategory, selectedSubcategory, labValues, customParameters]);

  // Manejar cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setLabValues({});
  };

  // Manejar cambio de subcategoría
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setLabValues({});
  };

  // Manejar cambio de valor
  const handleValueChange = (parameterName, value) => {
    setLabValues(prev => ({
      ...prev,
      [parameterName]: value
    }));
  };

  // Agregar parámetro personalizado
  const addCustomParameter = () => {
    const name = document.getElementById('custom-param-name').value;
    const value = document.getElementById('custom-param-value').value;
    const unit = document.getElementById('custom-param-unit').value;

    if (name && value) {
      setCustomParameters(prev => [...prev, {
        name,
        value: parseFloat(value),
        unit,
        id: Date.now()
      }]);

      // Limpiar campos
      document.getElementById('custom-param-name').value = '';
      document.getElementById('custom-param-value').value = '';
      document.getElementById('custom-param-unit').value = '';
    }
  };

  // Remover parámetro personalizado
  const removeCustomParameter = (id) => {
    setCustomParameters(prev => prev.filter(param => param.id !== id));
  };

  // Obtener rango normal considerando género
  const getNormalRange = (parameter) => {
    if (typeof parameter.normalRange === 'object') {
      const gender = patientData.genero?.toLowerCase();
      if (gender === 'masculino' && parameter.normalRange.male) {
        return parameter.normalRange.male;
      } else if (gender === 'femenino' && parameter.normalRange.female) {
        return parameter.normalRange.female;
      } else {
        return parameter.normalRange.male || parameter.normalRange.female;
      }
    }
    return parameter.normalRange;
  };

  // Evaluar si un valor está en rango normal
  const evaluateValue = (value, normalRange) => {
    if (!value || !normalRange) return 'normal';

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'normal';

    // Parsear rangos como "70-100" o "<200" o ">40"
    if (normalRange.includes('-')) {
      const [min, max] = normalRange.split('-').map(v => parseFloat(v.trim()));
      if (numValue < min) return 'low';
      if (numValue > max) return 'high';
      return 'normal';
    } else if (normalRange.startsWith('<')) {
      const max = parseFloat(normalRange.substring(1));
      return numValue > max ? 'high' : 'normal';
    } else if (normalRange.startsWith('>')) {
      const min = parseFloat(normalRange.substring(1));
      return numValue < min ? 'low' : 'normal';
    }

    return 'normal';
  };

  // Obtener color según el estado del valor
  const getValueColor = (value, normalRange) => {
    const status = evaluateValue(value, normalRange);
    switch (status) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="universal-lab-input bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          🧪 Valores de Laboratorio (Opcional)
        </h3>
        <p className="text-sm text-gray-600">
          Ingresa valores específicos para un análisis más preciso. El sistema detectará automáticamente valores anormales.
        </p>
      </div>

      {/* Selector de categoría */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Análisis
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar tipo de análisis...</option>
          {Object.entries(LAB_CATEGORIES).map(([key, category]) => (
            <option key={key} value={key}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de subcategoría */}
      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategoría
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar subcategoría...</option>
            {Object.entries(LAB_CATEGORIES[selectedCategory].subcategories).map(([key, subcategory]) => (
              <option key={key} value={key}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Parámetros de la subcategoría seleccionada */}
      {selectedCategory && selectedSubcategory && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Parámetros - {LAB_CATEGORIES[selectedCategory].subcategories[selectedSubcategory].name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAB_CATEGORIES[selectedCategory].subcategories[selectedSubcategory].parameters.map((parameter, index) => {
              const normalRange = getNormalRange(parameter);
              const currentValue = labValues[parameter.name];
              const valueColor = currentValue ? getValueColor(currentValue, normalRange) : '';

              return (
                <div key={index} className="lab-parameter-input">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {parameter.name}
                    {parameter.unit && (
                      <span className="text-gray-500 ml-1">({parameter.unit})</span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`Normal: ${normalRange}`}
                    value={labValues[parameter.name] || ''}
                    onChange={(e) => handleValueChange(parameter.name, e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${valueColor}`}
                  />
                  {currentValue && (
                    <div className="mt-1 text-xs">
                      <span className="text-gray-600">Normal: {normalRange}</span>
                      {evaluateValue(currentValue, normalRange) !== 'normal' && (
                        <span className="ml-2 font-medium">
                          {evaluateValue(currentValue, normalRange) === 'high' ? '⚠️ Alto' : '⚠️ Bajo'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Parámetros personalizados */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium text-gray-800">
            Parámetros Adicionales
          </h4>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showCustomInput ? 'Ocultar' : '+ Agregar parámetro'}
          </button>
        </div>

        {/* Input para parámetros personalizados */}
        {showCustomInput && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                id="custom-param-name"
                type="text"
                placeholder="Nombre del parámetro"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="custom-param-value"
                type="number"
                step="0.01"
                placeholder="Valor"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="custom-param-unit"
                type="text"
                placeholder="Unidad (ej: mg/dL)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addCustomParameter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        {/* Lista de parámetros personalizados */}
        {customParameters.length > 0 && (
          <div className="space-y-2">
            {customParameters.map((param) => (
              <div key={param.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm">
                  <strong>{param.name}:</strong> {param.value} {param.unit}
                </span>
                <button
                  type="button"
                  onClick={() => removeCustomParameter(param.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de valores ingresados */}
      {(Object.keys(labValues).length > 0 || customParameters.length > 0) && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            📊 Resumen de Valores Ingresados
          </h4>
          <div className="text-sm text-blue-700">
            <p>
              {Object.keys(labValues).length} parámetros estándar + {customParameters.length} parámetros personalizados
            </p>
            <p className="mt-1">
              Estos valores serán correlacionados automáticamente con las imágenes médicas y síntomas para un análisis integral.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalLabInput;
