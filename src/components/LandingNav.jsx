import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

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

  return (
    <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-container">
        <div className="landing-nav-logo">
          <Link to="/">
            <img src="images/symbol.png" alt="MediScan Logo" className="logo-image" />
            <span className="logo-text">MediScan AI</span>
          </Link>
        </div>

        <div className="landing-nav-links desktop-only">
          <a href="#why-use" className="landing-nav-link">¿Por qué usarlo?</a>
          <a href="#why-trust" className="landing-nav-link">¿Por qué confiar?</a>
          <a href="#solutions" className="landing-nav-link">Soluciones</a>
          <a href="#value" className="landing-nav-link">Valor</a>
        </div>

        <div className="landing-nav-actions desktop-only">
          <Link to="/app" className="landing-nav-button">Acceder</Link>
        </div>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="mobile-menu"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-links">
          <a href="#why-use" className="mobile-menu-link" onClick={toggleMobileMenu}>¿Por qué usarlo?</a>
          <a href="#why-trust" className="mobile-menu-link" onClick={toggleMobileMenu}>¿Por qué confiar?</a>
          <a href="#solutions" className="mobile-menu-link" onClick={toggleMobileMenu}>Soluciones</a>
          <a href="#value" className="mobile-menu-link" onClick={toggleMobileMenu}>Valor</a>
          <Link to="/app" className="mobile-menu-button" onClick={toggleMobileMenu}>Acceder</Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default LandingNav;
