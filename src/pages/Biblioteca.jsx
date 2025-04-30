import React from 'react';
import { Link } from 'react-router-dom';

function Biblioteca() {
  return (
    <div className="biblioteca-page">
      <div className="container">
        <h2 className="page-title">Biblioteca Médica</h2>
        <p className="page-description">Recursos y referencias para profesionales médicos</p>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Esta sección está en desarrollo. Pronto tendrás acceso a nuestra biblioteca médica completa.
            </div>
          </div>
        </div>

        {/* Categorías de la biblioteca */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="library-category">
              <div className="category-icon">
                <i className="bi bi-lungs"></i>
              </div>
              <h3>Radiología Torácica</h3>
              <p>Recursos especializados en radiografías de tórax, pulmones y sistema respiratorio.</p>
              <Link to="#" className="btn btn-outline-primary btn-sm">Explorar</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="library-category">
              <div className="category-icon">
                <i className="bi bi-bone"></i>
              </div>
              <h3>Traumatología</h3>
              <p>Información sobre fracturas, lesiones óseas y análisis de radiografías ortopédicas.</p>
              <Link to="#" className="btn btn-outline-primary btn-sm">Explorar</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="library-category">
              <div className="category-icon">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <h3>Cardiología</h3>
              <p>Recursos sobre radiografías cardíacas, interpretación y patologías comunes.</p>
              <Link to="#" className="btn btn-outline-primary btn-sm">Explorar</Link>
            </div>
          </div>
        </div>

        {/* Artículos destacados */}
        <div className="row mt-5">
          <div className="col-md-12">
            <h3 className="section-title">Artículos destacados</h3>
          </div>

          <div className="col-md-6">
            <div className="article-card">
              <h4>Guía para la interpretación de radiografías de tórax</h4>
              <p className="article-meta">Por Dr. Martínez | 10 de abril, 2024</p>
              <p className="article-excerpt">
                Una guía completa para médicos sobre cómo interpretar correctamente radiografías torácicas y detectar anomalías comunes.
              </p>
              <Link to="#" className="btn btn-link">Leer más →</Link>
            </div>
          </div>

          <div className="col-md-6">
            <div className="article-card">
              <h4>Patrones radiológicos en neumonía: lo que debes saber</h4>
              <p className="article-meta">Por Dra. Sánchez | 5 de abril, 2024</p>
              <p className="article-excerpt">
                Análisis detallado de los diferentes patrones radiológicos que pueden observarse en casos de neumonía y su significado clínico.
              </p>
              <Link to="#" className="btn btn-link">Leer más →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Biblioteca;
