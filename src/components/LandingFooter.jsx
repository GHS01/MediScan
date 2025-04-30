import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img src="images/symbol.png" alt="MediScan Logo" className="footer-logo-image" />
              <h3 className="footer-logo">MediScan AI</h3>
            </div>
            <p className="footer-tagline">Transformando la medicina con inteligencia artificial</p>
            <div className="footer-social">
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Enlaces rápidos</h4>
            <ul>
              <li><a href="#why-use">¿Por qué usarlo?</a></li>
              <li><a href="#why-trust">¿Por qué confiar?</a></li>
              <li><a href="#solutions">Soluciones</a></li>
              <li><a href="#value">Valor</a></li>
              <li><Link to="/app">Acceder a la plataforma</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Recursos</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Casos de estudio</a></li>
              <li><a href="#">Documentación</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
              <li><a href="#">Soporte</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contacto</h4>
            <div className="contact-info">
              <p><FaEnvelope className="contact-icon" /> info@mediscanai.com</p>
              <p><FaPhone className="contact-icon" /> +34 900 123 456</p>
              <p><FaMapMarkerAlt className="contact-icon" /> Calle Innovación 123, Madrid, España</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2024 MediScan AI. Todos los derechos reservados.</p>
          </div>
          <div className="footer-legal">
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Política de cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
