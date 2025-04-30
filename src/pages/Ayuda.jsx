import React from 'react';
import { Link } from 'react-router-dom';

function Ayuda() {
  return (
    <div className="ayuda-page">
      <div className="container">
        <h2 className="page-title">Centro de Ayuda</h2>
        <p className="page-description">Encuentra respuestas a tus preguntas y aprende a usar MediScan AI</p>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="help-sidebar">
              <h3>Categorías</h3>
              <ul className="help-categories">
                <li className="active"><a href="#primeros-pasos">Primeros pasos</a></li>
                <li><a href="#analisis">Análisis de radiografías</a></li>
                <li><a href="#cuenta">Gestión de cuenta</a></li>
                <li><a href="#privacidad">Privacidad y seguridad</a></li>
                <li><a href="#facturacion">Facturación</a></li>
                <li><a href="#problemas">Solución de problemas</a></li>
              </ul>

              <div className="help-contact mt-5">
                <h3>¿Necesitas más ayuda?</h3>
                <p>Nuestro equipo de soporte está disponible para ayudarte.</p>
                <button className="btn btn-primary">Contactar soporte</button>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="help-content">
              <section id="primeros-pasos">
                <h3>Primeros pasos con MediScan AI</h3>

                <div className="help-article">
                  <h4>¿Cómo funciona MediScan AI?</h4>
                  <p>
                    MediScan AI utiliza algoritmos avanzados de inteligencia artificial para analizar radiografías médicas.
                    Nuestro sistema está entrenado con millones de imágenes y puede detectar patrones y anomalías con alta precisión.
                  </p>
                  <p>
                    Para comenzar, simplemente sube tu radiografía en la sección de Análisis y nuestro sistema la procesará
                    automáticamente. Recibirás un análisis detallado en segundos.
                  </p>
                </div>

                <div className="help-article">
                  <h4>¿Qué tipos de radiografías puedo analizar?</h4>
                  <p>
                    Actualmente, MediScan AI puede analizar los siguientes tipos de radiografías:
                  </p>
                  <ul>
                    <li>Radiografías de tórax</li>
                    <li>Radiografías óseas (extremidades, columna)</li>
                    <li>Radiografías dentales</li>
                    <li>Radiografías abdominales</li>
                  </ul>
                  <p>
                    Estamos trabajando constantemente para ampliar nuestras capacidades y añadir más tipos de imágenes médicas.
                  </p>
                </div>

                <div className="help-article">
                  <h4>Requisitos técnicos</h4>
                  <p>
                    Para obtener los mejores resultados, recomendamos:
                  </p>
                  <ul>
                    <li>Imágenes en formato JPG, PNG o WEBP</li>
                    <li>Tamaño máximo de archivo: 4MB</li>
                    <li>Resolución mínima recomendada: 1000x1000 píxeles</li>
                    <li>Navegador actualizado (Chrome, Firefox, Safari o Edge)</li>
                  </ul>
                </div>
              </section>

              <section id="analisis" className="mt-5">
                <h3>Análisis de radiografías</h3>

                <div className="help-article">
                  <h4>¿Cómo interpretar los resultados?</h4>
                  <p>
                    Después de procesar tu radiografía, MediScan AI proporcionará un análisis detallado que incluye:
                  </p>
                  <ul>
                    <li>Descripción general de la imagen</li>
                    <li>Identificación de estructuras anatómicas</li>
                    <li>Detección de posibles anomalías</li>
                    <li>Sugerencias para consideración clínica</li>
                  </ul>
                  <p>
                    Recuerda que MediScan AI es una herramienta de asistencia y no reemplaza el juicio clínico profesional.
                    Siempre debes utilizar tu experiencia médica para interpretar los resultados.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ayuda;
