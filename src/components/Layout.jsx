import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <Link to="/app" className="brand-link">
              <img src="images/logo.png" alt="MediScan Logo" className="brand-logo" />
              <h1 className="brand-name">MediScan AI</h1>
              <p className="brand-slogan">Análisis con Inteligencia Artificial</p>
            </Link>
          </div>

          <nav className="header-nav">
            <div className="nav-container">
              <div className="nav-links desktop-nav">
                <Link to="/app" className={`nav-link ${isActive('/app')}`}>Inicio</Link>
                <Link to="/analisis" className={`nav-link ${isActive('/analisis')}`}>Análisis</Link>
                <Link to="/historial" className={`nav-link ${isActive('/historial')}`}>Historial</Link>
                <Link to="/biblioteca" className={`nav-link ${isActive('/biblioteca')}`}>Biblioteca Médica</Link>
                <Link to="/ayuda" className={`nav-link ${isActive('/ayuda')}`}>Ayuda</Link>
              </div>
              <div className="nav-user desktop-nav">
                <Link to="/perfil" className={`nav-link ${isActive('/perfil')}`}>Mi Perfil</Link>
              </div>

              <button
                className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Menú"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </nav>
        </div>

        {/* Menú móvil */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <Link to="/app" className={`mobile-nav-link ${isActive('/app')}`} onClick={toggleMobileMenu}>Inicio</Link>
            <Link to="/analisis" className={`mobile-nav-link ${isActive('/analisis')}`} onClick={toggleMobileMenu}>Análisis</Link>
            <Link to="/historial" className={`mobile-nav-link ${isActive('/historial')}`} onClick={toggleMobileMenu}>Historial</Link>
            <Link to="/biblioteca" className={`mobile-nav-link ${isActive('/biblioteca')}`} onClick={toggleMobileMenu}>Biblioteca Médica</Link>
            <Link to="/ayuda" className={`mobile-nav-link ${isActive('/ayuda')}`} onClick={toggleMobileMenu}>Ayuda</Link>
            <Link to="/perfil" className={`mobile-nav-link ${isActive('/perfil')}`} onClick={toggleMobileMenu}>Mi Perfil</Link>
          </div>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer-modern">
        <div className="footer-content-modern">
          <div className="footer-main">
            <div className="footer-brand-section">
              <div className="footer-logo-modern">
                <img src="images/logo.png" alt="MediScan Logo" className="footer-brand-logo" />
                <div className="footer-brand-text">
                  <span className="footer-brand-name">MediScan AI</span>
                  <span className="footer-brand-tagline">Inteligencia Artificial Médica</span>
                </div>
              </div>
              <p className="footer-description">
                Transformando el diagnóstico médico con tecnología de vanguardia y análisis precisos.
              </p>
            </div>

            <div className="footer-links-section">
              <div className="footer-links-group">
                <h4 className="footer-links-title">Plataforma</h4>
                <div className="footer-links-modern">
                  <a href="#" className="footer-link-modern">Análisis</a>
                  <a href="#" className="footer-link-modern">Historial</a>
                  <a href="#" className="footer-link-modern">Biblioteca</a>
                </div>
              </div>

              <div className="footer-links-group">
                <h4 className="footer-links-title">Soporte</h4>
                <div className="footer-links-modern">
                  <a href="#" className="footer-link-modern">Ayuda</a>
                  <a href="#" className="footer-link-modern">Contacto</a>
                  <a href="#" className="footer-link-modern">Documentación</a>
                </div>
              </div>

              <div className="footer-links-group">
                <h4 className="footer-links-title">Legal</h4>
                <div className="footer-links-modern">
                  <a href="#" className="footer-link-modern">Términos</a>
                  <a href="#" className="footer-link-modern">Privacidad</a>
                  <a href="#" className="footer-link-modern">Cookies</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-modern">
            <div className="footer-copyright-modern">
              <p>© 2024 MediScan AI. Todos los derechos reservados.</p>
            </div>
            <div className="footer-tech-badge">
              <span className="tech-badge">
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
    </div>
  );
}

export default Layout;
