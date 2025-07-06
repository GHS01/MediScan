import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="landing-footer-modern">
      <div className="landing-footer-content">
        <div className="landing-footer-main">
          <div className="landing-footer-brand-section">
            <div className="landing-footer-logo-modern">
              <img src="images/logo.png" alt="MediScan Logo" className="landing-footer-brand-logo" />
              <div className="landing-footer-brand-text">
                <span className="landing-footer-brand-name">MediScan AI</span>
                <span className="landing-footer-brand-tagline">Inteligencia Artificial Médica</span>
              </div>
            </div>
            <p className="landing-footer-description">
              Transformando el diagnóstico médico con tecnología de vanguardia y análisis precisos.
            </p>
          </div>

          <div className="landing-footer-links-section">
            <div className="landing-footer-links-group">
              <h4 className="landing-footer-links-title">Plataforma</h4>
              <div className="landing-footer-links-modern">
                <a href="#why-use" className="landing-footer-link-modern">¿Por qué usarlo?</a>
                <a href="#why-trust" className="landing-footer-link-modern">¿Por qué confiar?</a>
                <a href="#solutions" className="landing-footer-link-modern">Soluciones</a>
                <a href="#value" className="landing-footer-link-modern">Valor</a>
                <Link to="/app" className="landing-footer-link-modern">Acceder a la plataforma</Link>
              </div>
            </div>

            <div className="landing-footer-links-group">
              <h4 className="landing-footer-links-title">Soporte</h4>
              <div className="landing-footer-links-modern">
                <a href="#" className="landing-footer-link-modern">Blog</a>
                <a href="#" className="landing-footer-link-modern">Casos de estudio</a>
                <a href="#" className="landing-footer-link-modern">Documentación</a>
                <a href="#" className="landing-footer-link-modern">Preguntas frecuentes</a>
                <a href="#" className="landing-footer-link-modern">Soporte</a>
              </div>
            </div>

            <div className="landing-footer-links-group">
              <h4 className="landing-footer-links-title">Legal</h4>
              <div className="landing-footer-links-modern">
                <a href="#" className="landing-footer-link-modern">Términos</a>
                <a href="#" className="landing-footer-link-modern">Privacidad</a>
                <a href="#" className="landing-footer-link-modern">Cookies</a>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom-modern">
          <div className="landing-footer-copyright-modern">
            <p>© 2024 MediScan AI. Todos los derechos reservados.</p>
          </div>
          <div className="landing-footer-tech-badge">
            <span className="landing-tech-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Powered by Google Gemini
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
