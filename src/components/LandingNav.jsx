import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Función para scroll suave a una sección
  const scrollToSection = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navHeight = document.querySelector('.landing-nav').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      console.error(`Elemento con ID ${targetId} no encontrado`);
    }
  };

  // Función para manejar clics en enlaces de escritorio
  const handleDesktopLinkClick = (event, targetId) => {
    event.preventDefault();
    scrollToSection(targetId);
  };

  // Función para manejar clics en enlaces móviles
  const handleMobileLinkClick = (event, targetId) => {
    // Cerramos el menú móvil
    setMobileMenuOpen(false);

    // Scroll suave a la sección
    if (targetId) {
      event.preventDefault();

      // Pequeño retraso para asegurar que el DOM esté actualizado después de cerrar el menú
      setTimeout(() => {
        scrollToSection(targetId);
      }, 100);
    }
  };

  return (
    <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-container">
        <div className="landing-nav-logo">
          <Link to="/">
            <img src="images/logo.png" alt="MediScan Logo" className="logo-image" />
            <span className="logo-text">MediScan AI</span>
          </Link>
        </div>

        <div className="landing-nav-links desktop-only">
          <a href="#why-use" className="landing-nav-link" onClick={(e) => handleDesktopLinkClick(e, 'why-use')}>¿Por qué usarlo?</a>
          <a href="#why-trust" className="landing-nav-link" onClick={(e) => handleDesktopLinkClick(e, 'why-trust')}>¿Por qué confiar?</a>
          <a href="#solutions" className="landing-nav-link" onClick={(e) => handleDesktopLinkClick(e, 'solutions')}>Soluciones</a>
          <a href="#value" className="landing-nav-link" onClick={(e) => handleDesktopLinkClick(e, 'value')}>Valor</a>
        </div>

        <div className="landing-nav-actions desktop-only">
          <Link to="/app" className="landing-nav-button">Acceder</Link>
        </div>

        <button
          className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        initial={{ height: 0, opacity: 0, y: -20 }}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-links">
          <a href="#why-use" className="mobile-menu-link" onClick={(e) => handleMobileLinkClick(e, 'why-use')}>¿Por qué usarlo?</a>
          <a href="#why-trust" className="mobile-menu-link" onClick={(e) => handleMobileLinkClick(e, 'why-trust')}>¿Por qué confiar?</a>
          <a href="#solutions" className="mobile-menu-link" onClick={(e) => handleMobileLinkClick(e, 'solutions')}>Soluciones</a>
          <a href="#value" className="mobile-menu-link" onClick={(e) => handleMobileLinkClick(e, 'value')}>Valor</a>
          <div className="mobile-menu-button-container">
            <Link to="/app" className="mobile-menu-button" onClick={() => setMobileMenuOpen(false)}>Acceder</Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default LandingNav;
