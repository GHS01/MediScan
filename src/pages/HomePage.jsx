import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaGlobe, FaRobot, FaCogs, FaUsers, FaChartLine, FaShieldAlt, FaUserMd, FaHospital, FaSearch, FaFileAlt, FaGlobeAmericas } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';

const HomePage = () => {
  return (
    <div className="home-page">
      <LandingNav />
      <HeroSection />
      <WhyUseSection />
      <WhyTrustSection />
      <SolutionsSection />
      <ValueSection />
      <CallToAction />
      <LandingFooter />
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Diagnósticos médicos potenciados por <span className="gradient-text">Inteligencia Artificial</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Transformando la medicina con análisis de imágenes médicas rápidos, precisos y accesibles
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-buttons"
        >
          <Link to="/app" className="btn-primary hero-btn">Comenzar ahora</Link>
          <Link to="/app" className="btn-secondary hero-btn">Ver demostración</Link>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="hero-image"
      >
        <div className="hero-image-container">
          <img src="images/Portada.jpg" alt="MediScan AI en acción" />
          <div className="hero-image-overlay"></div>
        </div>
      </motion.div>
    </section>
  );
};

// Why Use Section
const WhyUseSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const features = [
    {
      icon: <FaClock size={40} className="feature-icon" color="#ffffff" />,
      title: "Velocidad revolucionaria",
      description: "Análisis de imágenes en minutos, no en horas o días, acelerando diagnósticos y tratamientos."
    },
    {
      icon: <FaGlobe size={40} className="feature-icon" color="#ffffff" />,
      title: "Acceso universal",
      description: "Disponible 24/7 desde cualquier dispositivo con conexión a internet, ideal para cualquier entorno médico."
    },
    {
      icon: <FaRobot size={40} className="feature-icon" color="#ffffff" />,
      title: "Asistente inteligente",
      description: "Ofrece análisis preliminares detallados, permitiendo a los radiólogos enfocarse en decisiones críticas."
    },
    {
      icon: <FaCogs size={40} className="feature-icon" color="#ffffff" />,
      title: "Versatilidad multimodal",
      description: "Analiza tomografías, radiografías, ecografías y resonancias magnéticas en una sola plataforma."
    },
    {
      icon: <FaUsers size={40} className="feature-icon" color="#ffffff" />,
      title: "Escalabilidad flexible",
      description: "Adecuado para hospitales de gran escala, pequeñas clínicas o consultorios individuales."
    },
    {
      icon: <FaChartLine size={40} className="feature-icon" color="#ffffff" />,
      title: "Evolución constante",
      description: "La IA se actualiza regularmente con nuevos datos médicos globales, mejorando su precisión."
    }
  ];

  return (
    <section className="why-use-section" id="why-use">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">¿Por qué usar <span className="gradient-text">MediScan AI</span>?</h2>
          <p className="section-subtitle">Descubre cómo nuestra plataforma revoluciona el análisis de imágenes médicas</p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
            >
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Why Trust Section
const WhyTrustSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="why-trust-section" id="why-trust">
      <div className="section-container">
        <div className="trust-content">
          <div className="section-header">
            <h2 className="section-title">¿Por qué confiar en <span className="gradient-text">MediScan AI</span>?</h2>
            <p className="section-subtitle">Tecnología respaldada por la ciencia y los más altos estándares de seguridad</p>
          </div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="trust-points"
          >
            <motion.div className="trust-point" variants={itemVariants}>
              <div className="trust-icon">
                <FaShieldAlt size={24} color="#ffffff" />
              </div>
              <div className="trust-point-content">
                <h3>Rigor científico</h3>
                <p>Entrenada con millones de imágenes médicas anonimizadas, validadas por radiólogos y especialistas de renombre.</p>
              </div>
            </motion.div>

            <motion.div className="trust-point" variants={itemVariants}>
              <div className="trust-icon">
                <FaFileAlt size={24} color="#ffffff" />
              </div>
              <div className="trust-point-content">
                <h3>Certificaciones de calidad</h3>
                <p>Cumple con normativas internacionales como HIPAA, GDPR, y certificaciones médicas, asegurando protección de datos.</p>
              </div>
            </motion.div>

            <motion.div className="trust-point" variants={itemVariants}>
              <div className="trust-icon">
                <FaUserMd size={24} color="#ffffff" />
              </div>
              <div className="trust-point-content">
                <h3>Equipo multidisciplinario</h3>
                <p>Desarrollada por expertos en IA, médicos radiólogos, ingenieros biomédicos y científicos de datos.</p>
              </div>
            </motion.div>

            <motion.div className="trust-point" variants={itemVariants}>
              <div className="trust-icon">
                <FaSearch size={24} color="#ffffff" />
              </div>
              <div className="trust-point-content">
                <h3>Transparencia en resultados</h3>
                <p>Los informes incluyen explicaciones claras y visualizaciones para que los médicos comprendan las conclusiones.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="trust-image"
        >
          <img src="images/medico-usando-ai.jpg" alt="Médico confiando en MediScan AI" />
        </motion.div>
      </div>
    </section>
  );
};

// Solutions Section
const SolutionsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const solutions = [
    {
      icon: <FaSearch size={28} className="solution-icon" color="#ffffff" />,
      title: "Minimización de errores",
      description: "Detecta patrones sutiles, reduciendo falsos negativos y mejorando la precisión diagnóstica."
    },
    {
      icon: <FaClock size={28} className="solution-icon" color="#ffffff" />,
      title: "Ahorro de tiempo crítico",
      description: "Automatiza el análisis inicial, permitiendo priorizar casos urgentes."
    },
    {
      icon: <FaGlobeAmericas size={28} className="solution-icon" color="#ffffff" />,
      title: "Diagnósticos en áreas remotas",
      description: "Proporciona análisis de alta calidad a clínicas sin acceso a radiólogos especializados."
    },
    {
      icon: <FaHospital size={28} className="solution-icon" color="#ffffff" />,
      title: "Integración fluida",
      description: "Compatible con sistemas hospitalarios como PACS y EMR, facilitando la incorporación en flujos de trabajo existentes."
    }
  ];

  return (
    <section className="solutions-section" id="solutions">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">¿Qué soluciones ofrece <span className="gradient-text">MediScan AI</span>?</h2>
          <p className="section-subtitle">Transformando desafíos en oportunidades para mejorar la atención médica</p>
        </div>

        <div className="solutions-content">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="solutions-tabs"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="solution-tab"
                variants={itemVariants}
              >
                <div className="solution-icon-container">
                  {solution.icon}
                </div>
                <div className="solution-tab-content">
                  <h3 className="solution-title">{solution.title}</h3>
                  <p className="solution-description">{solution.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="solutions-showcase"
          >
            <div className="solutions-image">
              <img src="images/mediscanai.jpg" alt="MediScan AI en acción" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Value Section
const ValueSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const valuePoints = [
    {
      title: "Paciente",
      value: "Diagnóstico en menos de 10 minutos",
      icon: <FaUserMd size={36} color="#ffffff" />
    },
    {
      title: "Médico",
      value: "50% menos tiempo en análisis inicial",
      icon: <FaUserMd size={36} color="#ffffff" />
    },
    {
      title: "Clínica",
      value: "30% más pacientes atendidos",
      icon: <FaHospital size={36} color="#ffffff" />
    },
    {
      title: "Comunidad",
      value: "Diagnósticos accesibles en zonas rurales",
      icon: <FaGlobeAmericas size={36} color="#ffffff" />
    }
  ];

  return (
    <section className="value-section" id="value">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">¿Cómo aporta valor <span className="gradient-text">MediScan AI</span>?</h2>
          <p className="section-subtitle">Impacto tangible en pacientes, médicos, clínicas y comunidades</p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="value-metrics"
        >
          {valuePoints.map((point, index) => (
            <motion.div
              key={index}
              className="value-metric"
              variants={itemVariants}
            >
              <div className="value-icon">
                {point.icon}
              </div>
              <h3 className="value-title">{point.title}</h3>
              <div className="value-data">{point.value}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="value-chart"
        >
          <div className="chart-container">
            <h3 className="chart-title">Precisión diagnóstica</h3>
            <div className="chart-bars">
              <div className="chart-bar">
                <div className="bar-label">Radiólogos</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: '92%' }}>92%</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="bar-label">MediScan AI</div>
                <div className="bar-container">
                  <div className="bar bar-highlight" style={{ width: '98%' }}>98%</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="bar-label">Combinados</div>
                <div className="bar-container">
                  <div className="bar bar-combined" style={{ width: '99.5%' }}>99.5%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Call to Action
const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="cta-content"
        >
          <h2 className="cta-title">Transforme su práctica médica hoy</h2>
          <p className="cta-description">
            Únase a los miles de profesionales médicos que ya están utilizando MediScan AI para mejorar sus diagnósticos y la atención a sus pacientes.
          </p>
          <div className="cta-buttons">
            <Link to="/app" className="btn-primary hero-btn">Comenzar ahora</Link>
            <Link to="/app" className="btn-secondary hero-btn">Solicitar demostración</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="cta-testimonial"
        >
          <div className="testimonial-content simple">

            <p className="testimonial-text">
              MediScan AI ha revolucionado nuestra práctica clínica. Los diagnósticos son más rápidos y precisos, permitiéndonos atender a más pacientes con mayor confianza.
            </p>
            <div className="testimonial-author">
              <img src="images/paula.jpg" alt="Dra. Jiménez" className="author-avatar" />
              <div className="author-info">
                <h4 className="author-name">Dra. Paula Jiménez</h4>
                <p className="author-title">Jefe de Radiología, Hospital Central</p>
              </div>
            </div>
            <div className="testimonial-rating">
              ★★★★★
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;
