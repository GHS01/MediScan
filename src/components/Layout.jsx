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
              <img src="images/symbol.png" alt="MediScan Logo" className="brand-logo" />
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

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="images/symbol.png" alt="MediScan Logo" className="footer-brand-logo" />
            <span>MediScan AI</span>
          </div>
          <div className="footer-accent"></div>
          <div className="footer-links">
            <a href="#" className="footer-link">Términos y Condiciones</a>
            <a href="#" className="footer-link">Política de Privacidad</a>
            <a href="#" className="footer-link">Contacto</a>
            <a href="#" className="footer-link">Soporte</a>
          </div>
          <p>© 2024 MediScan AI - Desarrollado con tecnología de Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
