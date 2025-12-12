import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import MetricCard from './MetricCard'
import ChartCard from './ChartCard'
import LoadingSpinner from './LoadingSpinner'
import DateFilter from './DateFilter'
import './FincaDashboard.css'

function FincaDashboard({ finca }) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState('all')

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
          const dataPath = `${basePath}data/${fincaLower}.json`
          console.log('Cargando datos estáticos desde:', dataPath)
          const response = await fetch(dataPath)
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

  // Obtener fechas disponibles (hooks deben estar antes de returns condicionales)
  const availableDates = useMemo(() => {
    if (!metrics || !metrics.por_fecha) return []
    const dates = Object.keys(metrics.por_fecha).sort()
    return dates
  }, [metrics])

  // Filtrar datos por fecha seleccionada
  const filteredData = useMemo(() => {
    if (!metrics) return null
    if (selectedDate === 'all' || !metrics.personas_inscritas_vs_abordaron) {
      return metrics
    }
    
    const filtered = { ...metrics }
    
    // Filtrar personas_inscritas_vs_abordaron
    if (filtered.personas_inscritas_vs_abordaron) {
      filtered.personas_inscritas_vs_abordaron = filtered.personas_inscritas_vs_abordaron.filter(
        item => item.Fecha === selectedDate
      )
    }
    
    // Filtrar personas_vs_capacidad
    if (filtered.personas_vs_capacidad) {
      filtered.personas_vs_capacidad = filtered.personas_vs_capacidad.filter(
        item => item.Fecha === selectedDate
      )
    }
    
    // Actualizar totales con datos de la fecha seleccionada
    if (metrics.por_fecha && metrics.por_fecha[selectedDate]) {
      const fechaData = metrics.por_fecha[selectedDate]
      filtered.total_personas_inscritas = fechaData.inscritas || 0
      filtered.total_personas_abordaron = fechaData.abordaron || 0
      filtered.personas_llegaron = fechaData.llegaron || 0
      filtered.personas_se_fueron = fechaData.se_fueron || 0
      if (filtered.pasajeros_adicionales) {
        filtered.pasajeros_adicionales.Total = fechaData.pasajeros_extra || 0
        filtered.pasajeros_adicionales.Por_ruta = filtered.pasajeros_adicionales.Por_ruta?.filter(
          item => item.Fecha === selectedDate
        ) || []
      }
    }
    
    return filtered
  }, [metrics, selectedDate])

  // Identificar si el lunes (2025-12-08) tiene pocos datos (fue festivo)
  const mondayDate = '2025-12-08'
  const mondayData = metrics?.por_fecha?.[mondayDate]
  const isMondayHoliday = mondayData && mondayData.abordaron < 100 // Si tiene menos de 100 abordaron, probablemente fue festivo

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

  if (!metrics || !filteredData) {
    return (
      <div className="error-message">
        <h2>⚠️ No hay datos disponibles</h2>
      </div>
    )
  }

  return (
    <div className="finca-dashboard">
      <h2 className="dashboard-title">Finca {finca} - Métricas (8-11 Dic 2025)</h2>
      
      {isMondayHoliday && selectedDate === 'all' && (
        <div className="holiday-notice">
          <strong>📅 Nota:</strong> El lunes 8 de diciembre fue festivo, por lo que la cantidad de rutas y pasajeros fue significativamente menor ese día.
        </div>
      )}
      
      {availableDates.length > 0 && (
        <>
          <DateFilter 
            selectedDate={selectedDate}
            dates={availableDates}
            onDateChange={setSelectedDate}
            showHolidayWarning={isMondayHoliday && selectedDate === mondayDate}
          />
          {selectedDate === mondayDate && (
            <div className="holiday-notice">
              <strong>⚠️ Día Festivo:</strong> El lunes 8 de diciembre fue festivo, por lo que los datos de este día son limitados y no representativos de la operación normal.
            </div>
          )}
        </>
      )}

      {/* Métrica 1: Personas inscritas vs abordaron */}
      <section className="metric-section">
        <h3>1. Personas Inscritas vs Personas que Abordaron</h3>
        <div className="metrics-grid">
          <MetricCard
            title="Total Inscritas"
            value={filteredData.total_personas_inscritas || 0}
            subtitle="personas"
          />
          <MetricCard
            title="Total que Abordaron"
            value={filteredData.total_personas_abordaron || 0}
            subtitle="personas"
          />
          <MetricCard
            title="Tasa de Abordaje"
            value={
              filteredData.total_personas_inscritas > 0
                ? ((filteredData.total_personas_abordaron / filteredData.total_personas_inscritas) * 100).toFixed(1)
                : 0
            }
            subtitle="%"
          />
        </div>
        {filteredData.personas_inscritas_vs_abordaron && filteredData.personas_inscritas_vs_abordaron.length > 0 && (
          <ChartCard
            title={selectedDate === 'all' ? "Inscritas vs Abordaron por Ruta y Fecha" : `Inscritas vs Abordaron por Ruta (${selectedDate})`}
            data={filteredData.personas_inscritas_vs_abordaron.map(item => ({
              ...item,
              'Ruta-Fecha': selectedDate === 'all' ? `${item.Ruta} (${item.Fecha})` : item.Ruta
            }))}
            type="bar"
            xKey={selectedDate === 'all' ? 'Ruta-Fecha' : 'Ruta'}
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
        {filteredData.personas_vs_capacidad && filteredData.personas_vs_capacidad.length > 0 && (
          <ChartCard
            title={selectedDate === 'all' ? "Ocupación de Buses por Ruta y Fecha" : `Ocupación de Buses por Ruta (${selectedDate})`}
            data={filteredData.personas_vs_capacidad.map(item => ({
              ...item,
              'Ruta-Fecha': selectedDate === 'all' ? `${item.Ruta} (${item.Fecha})` : item.Ruta
            }))}
            type="bar"
            xKey={selectedDate === 'all' ? 'Ruta-Fecha' : 'Ruta'}
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
        {filteredData.rutas_con_problemas && filteredData.rutas_con_problemas.length > 0 ? (
          <>
            <div className="metrics-grid">
              <MetricCard
                title="Rutas con Problemas"
                value={filteredData.rutas_con_problemas.length}
                subtitle="rutas"
              />
              <MetricCard
                title="Total de Problemas"
                value={filteredData.rutas_con_problemas.reduce((sum, r) => sum + (r.Total_problemas || 0), 0)}
                subtitle="incidencias"
              />
            </div>
            <ChartCard
              title="Problemas por Ruta"
              data={filteredData.rutas_con_problemas.map(r => ({
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
                {filteredData.rutas_con_problemas.slice(0, 50).map((ruta, idx) => (
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
            value={filteredData.rutas_creadas || 0}
            subtitle="rutas"
          />
          <MetricCard
            title="Rutas Iniciadas"
            value={filteredData.rutas_iniciadas || 0}
            subtitle="rutas"
          />
          <MetricCard
            title="Tasa de Inicio"
            value={
              filteredData.rutas_creadas > 0
                ? ((filteredData.rutas_iniciadas / filteredData.rutas_creadas) * 100).toFixed(1)
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
            value={filteredData.personas_llegaron || 0}
            subtitle="personas"
            color="#4caf50"
          />
          <MetricCard
            title="Personas que Se Fueron"
            value={filteredData.personas_se_fueron || 0}
            subtitle="personas"
            color="#2196f3"
          />
        </div>
        <ChartCard
          title={selectedDate === 'all' ? "Llegadas vs Salidas (Todos los días)" : `Llegadas vs Salidas (${selectedDate})`}
          data={[
            { Tipo: 'Llegaron (AM)', Cantidad: filteredData.personas_llegaron || 0 },
            { Tipo: 'Se Fueron (PM)', Cantidad: filteredData.personas_se_fueron || 0 }
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
            value={filteredData.pasajeros_adicionales?.Total || 0}
            subtitle="personas"
            color="#ff9800"
          />
        </div>
        {filteredData.pasajeros_adicionales?.Por_ruta && filteredData.pasajeros_adicionales.Por_ruta.length > 0 && (
          <ChartCard
            title={selectedDate === 'all' ? "Pasajeros Adicionales por Ruta y Fecha" : `Pasajeros Adicionales por Ruta (${selectedDate})`}
            data={filteredData.pasajeros_adicionales.Por_ruta.map(item => ({
              ...item,
              'No. Ruta-Fecha': selectedDate === 'all' ? `${item['No. Ruta']} (${item.Fecha})` : item['No. Ruta']
            }))}
            type="bar"
            xKey={selectedDate === 'all' ? 'No. Ruta-Fecha' : 'No. Ruta'}
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
            value={filteredData.promedio_tiempo_viaje?.Promedio_minutos || 0}
            subtitle="minutos"
            color="#9c27b0"
          />
        </div>
        {filteredData.promedio_tiempo_viaje?.Por_ruta && filteredData.promedio_tiempo_viaje.Por_ruta.length > 0 && (
          <ChartCard
            title={selectedDate === 'all' ? "Tiempo de Viaje por Ruta y Fecha" : `Tiempo de Viaje por Ruta (${selectedDate})`}
            data={filteredData.promedio_tiempo_viaje.Por_ruta
              .filter(r => selectedDate === 'all' || r['Fecha inicio'] === selectedDate)
              .map(r => ({
              Ruta: r.Ruta,
              'Tiempo (min)': r.Tiempo_minutos || 0,
              'Ruta-Fecha': selectedDate === 'all' ? `${r.Ruta} (${r['Fecha inicio']})` : r.Ruta
            }))}
            type="bar"
            xKey={selectedDate === 'all' ? 'Ruta-Fecha' : 'Ruta'}
            yKeys={[
              { key: 'Tiempo (min)', label: 'Minutos', color: '#9c27b0' }
            ]}
          />
        )}
      </section>

      {/* Métricas por fecha - Solo mostrar si no hay filtro de fecha */}
      {selectedDate === 'all' && metrics.por_fecha && Object.keys(metrics.por_fecha).length > 0 && (
        <section className="metric-section">
          <h3>Resumen por Fecha (Todos los días)</h3>
          <ChartCard
            title="Métricas por Fecha"
            data={Object.entries(metrics.por_fecha).map(([fecha, data]) => ({
              Fecha: fecha.split('-')[2] + '/' + fecha.split('-')[1], // Día/Mes
              'Fecha completa': fecha,
              Inscritas: data.inscritas || 0,
              Abordaron: data.abordaron || 0,
              'Llegaron (AM)': data.llegaron || 0,
              'Se Fueron (PM)': data.se_fueron || 0
            }))}
            type="line"
            xKey="Fecha"
            yKeys={[
              { key: 'Inscritas', label: 'Inscritas', color: '#8884d8' },
              { key: 'Abordaron', label: 'Abordaron', color: '#82ca9d' },
              { key: 'Llegaron (AM)', label: 'Llegaron (AM)', color: '#4caf50' },
              { key: 'Se Fueron (PM)', label: 'Se Fueron (PM)', color: '#2196f3' }
            ]}
          />
        </section>
      )}
    </div>
  )
}

export default FincaDashboard

