import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaSearch, FaChartBar, FaSave, FaHistory, FaArrowRight, FaInfoCircle, FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import '../styles/HomeGuide.css';

function Home() {
  return (
    <div className="home-page home-guide-page">
      <section className="welcome-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="welcome-title">Bienvenido a MediScan AI</h1>
              <p className="welcome-subtitle">
                Tu asistente de diagnóstico médico potenciado por inteligencia artificial
              </p>
              <div className="welcome-description">
                <p>Esta guía te ayudará a aprovechar al máximo nuestra plataforma para obtener análisis precisos y rápidos de imágenes médicas.</p>
              </div>
              <div className="welcome-buttons">
                <Link to="/analisis" className="btn btn-primary btn-lg">Ir a la sección de análisis</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="welcome-image">
                <img src="images/DoctorAI.jpg" alt="Doctor usando MediScan AI" className="img-fluid rounded shadow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-to-section">
        <div className="container">
          <h2 className="section-title text-center">Cómo usar MediScan AI</h2>
          <p className="section-subtitle text-center">Sigue estos sencillos pasos para obtener análisis precisos de tus imágenes médicas</p>

          <div className="steps-container mt-5">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FaUpload className="icon" />
              </div>
              <h3 className="step-title">Carga tus imágenes</h3>
              <p className="step-description">
                Dirígete a la sección de <Link to="/analisis">Análisis</Link> y carga tus imágenes médicas.
                Puedes subir radiografías, tomografías, ecografías o resonancias magnéticas.
              </p>
              <div className="step-tip">
                <span className="tip-icon"><FaLightbulb /></span>
                <p>Consejo: Asegúrate de que tus imágenes estén en formato JPEG, PNG o DICOM para obtener mejores resultados.</p>
              </div>
            </div>

            <div className="step-connector">
              <FaArrowRight />
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <FaSearch className="icon" />
              </div>
              <h3 className="step-title">Obtén el análisis</h3>
              <p className="step-description">
                Nuestro sistema de IA analizará automáticamente tus imágenes y generará un informe detallado
                con posibles hallazgos, áreas de interés y sugerencias de diagnóstico.
              </p>
              <div className="step-tip">
                <span className="tip-icon"><FaLightbulb /></span>
                <p>Consejo: Puedes interactuar con la IA a través del chat para hacer preguntas específicas sobre el análisis.</p>
              </div>
            </div>

            <div className="step-connector">
              <FaArrowRight />
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FaSave className="icon" />
              </div>
              <h3 className="step-title">Guarda tus resultados</h3>
              <p className="step-description">
                Una vez finalizado el análisis, puedes guardar el informe completo en tu historial para
                futuras referencias o para compartirlo con otros profesionales médicos.
              </p>
              <div className="step-tip">
                <span className="tip-icon"><FaLightbulb /></span>
                <p>Consejo: Utiliza la función "Archivar Diagnóstico" para organizar tus análisis por paciente o tipo de estudio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-overview">
        <div className="container">
          <h2 className="section-title text-center">Funcionalidades principales</h2>
          <div className="row mt-5">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="feature-overview-card">
                <div className="feature-overview-icon">
                  <FaUpload />
                </div>
                <h3>Análisis</h3>
                <p>Carga y analiza imágenes médicas con nuestra IA avanzada.</p>
                <Link to="/analisis" className="feature-link">Ir a Análisis <FaArrowRight className="ms-2" /></Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="feature-overview-card">
                <div className="feature-overview-icon">
                  <FaHistory />
                </div>
                <h3>Historial</h3>
                <p>Accede a todos tus análisis previos organizados cronológicamente.</p>
                <Link to="/historial" className="feature-link">Ir a Historial <FaArrowRight className="ms-2" /></Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="feature-overview-card">
                <div className="feature-overview-icon">
                  <FaChartBar />
                </div>
                <h3>Biblioteca Médica</h3>
                <p>Consulta nuestra extensa biblioteca de recursos médicos y casos de estudio.</p>
                <Link to="/biblioteca" className="feature-link">Ir a Biblioteca <FaArrowRight className="ms-2" /></Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="feature-overview-card">
                <div className="feature-overview-icon">
                  <FaInfoCircle />
                </div>
                <h3>Ayuda</h3>
                <p>Encuentra respuestas a preguntas frecuentes y guías detalladas.</p>
                <Link to="/ayuda" className="feature-link">Ir a Ayuda <FaArrowRight className="ms-2" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-tips">
        <div className="container">
          <h2 className="section-title text-center">Consejos para obtener mejores resultados</h2>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="tip-card">
                <div className="tip-icon">
                  <FaRegLightbulb />
                </div>
                <div className="tip-content">
                  <h4>Calidad de imagen</h4>
                  <p>Utiliza imágenes de alta resolución y asegúrate de que estén correctamente orientadas para obtener análisis más precisos.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tip-card">
                <div className="tip-icon">
                  <FaRegLightbulb />
                </div>
                <div className="tip-content">
                  <h4>Datos del paciente</h4>
                  <p>Incluye información relevante como edad, sexo y síntomas para contextualizar mejor el análisis de la IA.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tip-card">
                <div className="tip-icon">
                  <FaRegLightbulb />
                </div>
                <div className="tip-content">
                  <h4>Preguntas específicas</h4>
                  <p>Formula preguntas claras y específicas a la IA para obtener respuestas más relevantes sobre el caso.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tip-card">
                <div className="tip-icon">
                  <FaRegLightbulb />
                </div>
                <div className="tip-content">
                  <h4>Revisión humana</h4>
                  <p>Recuerda que MediScan AI es una herramienta de asistencia. Siempre revisa los resultados con tu criterio profesional.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="get-started-section">
        <div className="container">
          <div className="get-started-content text-center">
            <h2>¿Listo para comenzar?</h2>
            <p>Dirígete a la sección de Análisis para cargar tu primera imagen médica</p>
            <Link to="/analisis" className="btn btn-primary btn-lg mt-4 get-started-btn">Comenzar análisis ahora</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
