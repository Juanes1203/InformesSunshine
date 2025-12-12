import React from 'react'
import { Link } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>🌻 Bienvenido a Informes Sunshine</h1>
        <p className="welcome-subtitle">Dashboard de Métricas para Fincas</p>
        
        <div className="welcome-description">
          <p>
            Este sistema te permite visualizar y analizar las métricas operativas de las fincas,
            incluyendo datos de rutas, pasajeros, capacidad de buses y más.
          </p>
        </div>

        <div className="fincas-selection">
          <h2>Selecciona una Finca para Ver sus Métricas</h2>
          <div className="fincas-grid">
            <Link to="/InformesSunshine/laureles" className="finca-card laureles">
              <div className="finca-icon">🌿</div>
              <h3>Finca Laureles</h3>
              <p>Ver métricas y análisis de Finca Laureles</p>
            </Link>
            <Link to="/InformesSunshine/yarumo" className="finca-card yarumo">
              <div className="finca-icon">🌳</div>
              <h3>Finca Yarumo</h3>
              <p>Ver métricas y análisis de Finca Yarumo</p>
            </Link>
          </div>
        </div>

        <div className="welcome-info">
          <h3>📊 Métricas Disponibles</h3>
          <ul>
            <li>Personas inscritas vs personas que abordaron</li>
            <li>Ocupación de buses por ruta</li>
            <li>Persistencia: Rutas con problemas</li>
            <li>Rutas creadas vs iniciadas</li>
            <li>Personas que llegaron vs se fueron</li>
            <li>Pasajeros adicionales</li>
            <li>Promedio de tiempo de viaje</li>
          </ul>
          
          <p className="date-range">
            <strong>Período de análisis:</strong> 8-11 de diciembre de 2025
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome

