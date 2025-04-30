import React from 'react';
import { Link } from 'react-router-dom';

function Perfil() {
  return (
    <div className="perfil-page">
      <div className="container">
        <h2 className="page-title">Mi Perfil</h2>
        <p className="page-description">Gestiona tu información personal y preferencias</p>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <img src="/src/assets/avatar-placeholder.jpg" alt="Avatar de usuario" className="img-fluid rounded-circle" />
                <button className="btn btn-sm btn-outline-primary mt-2">Cambiar foto</button>
              </div>

              <div className="profile-menu mt-4">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active" href="#informacion">Información personal</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#seguridad">Seguridad</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#preferencias">Preferencias</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#suscripcion">Suscripción</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#historial">Historial de análisis</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="profile-content">
              <section id="informacion">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Información personal</h3>
                    <button className="btn btn-sm btn-outline-primary">Editar</button>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Nombre</label>
                      </div>
                      <div className="col-md-8">
                        <p className="mb-0">Dr. Juan Pérez</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Especialidad</label>
                      </div>
                      <div className="col-md-8">
                        <p className="mb-0">Radiología</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Email</label>
                      </div>
                      <div className="col-md-8">
                        <p className="mb-0">juan.perez@hospital.com</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Teléfono</label>
                      </div>
                      <div className="col-md-8">
                        <p className="mb-0">+34 612 345 678</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Institución</label>
                      </div>
                      <div className="col-md-8">
                        <p className="mb-0">Hospital Central</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="estadisticas" className="mt-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="mb-0">Estadísticas de uso</h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="stat-card text-center">
                          <h4>45</h4>
                          <p>Análisis realizados</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="stat-card text-center">
                          <h4>12</h4>
                          <p>Este mes</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="stat-card text-center">
                          <h4>85%</h4>
                          <p>Cuota utilizada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
