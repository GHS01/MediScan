import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Analisis from './pages/Analisis';
import Historial from './pages/Historial';
import Biblioteca from './pages/Biblioteca';
import Ayuda from './pages/Ayuda';
import Perfil from './pages/Perfil';
import './App.css';
import './styles/HomePage.css';
import './styles/LandingNav.css';
import './styles/LandingFooter.css';
import './styles/HomeGuide.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Cargar fuente Inter de Google Fonts
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(linkElement);

    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
