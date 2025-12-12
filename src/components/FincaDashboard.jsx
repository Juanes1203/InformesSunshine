import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MetricCard from './MetricCard'
import ChartCard from './ChartCard'
import LoadingSpinner from './LoadingSpinner'
import './FincaDashboard.css'

function FincaDashboard({ finca }) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      setError(null)
      try {
        // Intentar primero con API (modo desarrollo)
        try {
          const response = await axios.get(`/api/metrics/${finca}`, {
            timeout: 3000,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          setMetrics(response.data)
        } catch (apiError) {
          // Si falla el API, cargar datos estáticos (modo producción/GitHub Pages)
          const fincaLower = finca.toLowerCase()
          const basePath = import.meta.env.BASE_URL || ''
          const response = await fetch(`${basePath}data/${fincaLower}.json`)
          if (!response.ok) {
            throw new Error(`No se pudo cargar los datos de ${finca}`)
          }
          const data = await response.json()
          setMetrics(data)
        }
      } catch (err) {
        let errorMessage = 'Error al cargar las métricas.'
        if (err.message) {
          errorMessage = `Error: ${err.message}`
        }
        setError(errorMessage)
        console.error('Error detallado:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [finca])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>❌ Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="error-message">
        <h2>⚠️ No hay datos disponibles</h2>
      </div>
    )
  }

  return (
    <div className="finca-dashboard">
      <h2 className="dashboard-title">Finca {finca} - Métricas (8-11 Dic 2025)</h2>

      {/* Métrica 1: Personas inscritas vs abordaron */}
      <section className="metric-section">
        <h3>1. Personas Inscritas vs Personas que Abordaron</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Total Inscritas"
            value={metrics.total_personas_inscritas || 0}
            subtitle="personas"
          />
          <MetricCard
            title="Total que Abordaron"
            value={metrics.total_personas_abordaron || 0}
            subtitle="personas"
          />
          <MetricCard
            title="Tasa de Abordaje"
            value={
              metrics.total_personas_inscritas > 0
                ? ((metrics.total_personas_abordaron / metrics.total_personas_inscritas) * 100).toFixed(1)
                : 0
            }
            subtitle="%"
          />
        </div>
        {metrics.personas_inscritas_vs_abordaron && metrics.personas_inscritas_vs_abordaron.length > 0 && (
          <ChartCard
            title="Inscritas vs Abordaron por Ruta"
            data={metrics.personas_inscritas_vs_abordaron}
            type="bar"
            xKey="Ruta"
            yKeys={[
              { key: 'Inscritas', label: 'Inscritas', color: '#8884d8' },
              { key: 'Abordaron', label: 'Abordaron', color: '#82ca9d' }
            ]}
          />
        )}
      </section>

      {/* Métrica 2: Personas vs Capacidad */}
      <section className="metric-section">
        <h3>2. Personas que Abordaron vs Capacidad de Bus</h3>
        {metrics.personas_vs_capacidad && metrics.personas_vs_capacidad.length > 0 && (
          <ChartCard
            title="Ocupación de Buses por Ruta"
            data={metrics.personas_vs_capacidad}
            type="bar"
            xKey="Ruta"
            yKeys={[
              { key: 'Abordaron', label: 'Abordaron', color: '#82ca9d' },
              { key: 'Capacidad_estimada', label: 'Capacidad', color: '#ffc658' }
            ]}
          />
        )}
      </section>

      {/* Métrica 3: Rutas con problemas */}
      <section className="metric-section">
        <h3>3. Persistencia: Rutas con Problemas</h3>
        {metrics.rutas_con_problemas && metrics.rutas_con_problemas.length > 0 ? (
          <>
            <div className="metrics-grid">
              <MetricCard
                title="Rutas con Problemas"
                value={metrics.rutas_con_problemas.length}
                subtitle="rutas"
              />
              <MetricCard
                title="Total de Problemas"
                value={metrics.rutas_con_problemas.reduce((sum, r) => sum + (r.Total_problemas || 0), 0)}
                subtitle="incidencias"
              />
            </div>
            <ChartCard
              title="Problemas por Ruta"
              data={metrics.rutas_con_problemas.map(r => ({
                Ruta: r.Ruta,
                Problemas: r.Total_problemas || 0
              }))}
              type="bar"
              xKey="Ruta"
              yKeys={[
                { key: 'Problemas', label: 'Cantidad de Problemas', color: '#ff6b6b' }
              ]}
            />
            <div className="problemas-detalle">
              <h4>Detalle de Problemas:</h4>
              <div className="problemas-list">
                {metrics.rutas_con_problemas.slice(0, 20).map((ruta, idx) => (
                  <div key={idx} className="problema-item">
                    <strong>{ruta.Ruta}</strong> - {ruta.Total_problemas} problema(s)
                    <ul>
                      {ruta.Detalles && ruta.Detalles.slice(0, 3).map((det, i) => (
                        <li key={i}>
                          {det.Fecha}: {det.Problemas.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="no-data">No se encontraron rutas con problemas registradas</p>
        )}
      </section>

      {/* Métrica 4: Rutas creadas vs iniciadas */}
      <section className="metric-section">
        <h3>4. Rutas Creadas vs Rutas Iniciadas</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Rutas Creadas"
            value={metrics.rutas_creadas || 0}
            subtitle="rutas"
          />
          <MetricCard
            title="Rutas Iniciadas"
            value={metrics.rutas_iniciadas || 0}
            subtitle="rutas"
          />
          <MetricCard
            title="Tasa de Inicio"
            value={
              metrics.rutas_creadas > 0
                ? ((metrics.rutas_iniciadas / metrics.rutas_creadas) * 100).toFixed(1)
                : 0
            }
            subtitle="%"
          />
        </div>
      </section>

      {/* Métrica 5: Llegadas y salidas */}
      <section className="metric-section">
        <h3>5. Personas que Llegaron vs Se Fueron en Buses</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Personas que Llegaron"
            value={metrics.personas_llegaron || 0}
            subtitle="personas"
            color="#4caf50"
          />
          <MetricCard
            title="Personas que Se Fueron"
            value={metrics.personas_se_fueron || 0}
            subtitle="personas"
            color="#2196f3"
          />
        </div>
        <ChartCard
          title="Llegadas vs Salidas"
          data={[
            { Tipo: 'Llegaron', Cantidad: metrics.personas_llegaron || 0 },
            { Tipo: 'Se Fueron', Cantidad: metrics.personas_se_fueron || 0 }
          ]}
          type="bar"
          xKey="Tipo"
          yKeys={[
            { key: 'Cantidad', label: 'Personas', color: '#8884d8' }
          ]}
        />
      </section>

      {/* Métrica 6: Pasajeros adicionales */}
      <section className="metric-section">
        <h3>6. Pasajeros Adicionales</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Total Pasajeros Adicionales"
            value={metrics.pasajeros_adicionales?.Total || 0}
            subtitle="personas"
            color="#ff9800"
          />
        </div>
        {metrics.pasajeros_adicionales?.Por_ruta && metrics.pasajeros_adicionales.Por_ruta.length > 0 && (
          <ChartCard
            title="Pasajeros Adicionales por Ruta"
            data={metrics.pasajeros_adicionales.Por_ruta}
            type="bar"
            xKey="No. Ruta"
            yKeys={[
              { key: 'Cantidad', label: 'Pasajeros Extra', color: '#ff9800' }
            ]}
          />
        )}
      </section>

      {/* Métrica 7: Tiempo de viaje */}
      <section className="metric-section">
        <h3>7. Promedio de Tiempo de Viaje</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Tiempo Promedio"
            value={metrics.promedio_tiempo_viaje?.Promedio_minutos || 0}
            subtitle="minutos"
            color="#9c27b0"
          />
        </div>
        {metrics.promedio_tiempo_viaje?.Por_ruta && metrics.promedio_tiempo_viaje.Por_ruta.length > 0 && (
          <ChartCard
            title="Tiempo de Viaje por Ruta"
            data={metrics.promedio_tiempo_viaje.Por_ruta.map(r => ({
              Ruta: r.Ruta,
              'Tiempo (min)': r.Tiempo_minutos || 0
            }))}
            type="bar"
            xKey="Ruta"
            yKeys={[
              { key: 'Tiempo (min)', label: 'Minutos', color: '#9c27b0' }
            ]}
          />
        )}
      </section>

      {/* Métricas por fecha */}
      {metrics.por_fecha && Object.keys(metrics.por_fecha).length > 0 && (
        <section className="metric-section">
          <h3>Resumen por Fecha</h3>
          <ChartCard
            title="Métricas por Fecha"
            data={Object.entries(metrics.por_fecha).map(([fecha, data]) => ({
              Fecha: fecha.split('-')[2], // Solo el día
              Inscritas: data.inscritas || 0,
              Abordaron: data.abordaron || 0,
              Llegaron: data.llegaron || 0,
              'Se Fueron': data.se_fueron || 0
            }))}
            type="line"
            xKey="Fecha"
            yKeys={[
              { key: 'Inscritas', label: 'Inscritas', color: '#8884d8' },
              { key: 'Abordaron', label: 'Abordaron', color: '#82ca9d' },
              { key: 'Llegaron', label: 'Llegaron', color: '#4caf50' },
              { key: 'Se Fueron', label: 'Se Fueron', color: '#2196f3' }
            ]}
          />
        </section>
      )}
    </div>
  )
}

export default FincaDashboard

