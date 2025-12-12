import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './ChartCard.css'

function ChartCard({ title, data, type, xKey, yKeys }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h4>{title}</h4>
        <p className="no-data">No hay datos disponibles para este gráfico</p>
      </div>
    )
  }

  // Limitar la cantidad de elementos en el eje X para mejor visualización
  const displayData = data.slice(0, 30)
  
  // Truncar nombres de rutas si son muy largos y normalizar claves
  const formattedData = displayData.map(item => {
    const newItem = { ...item }
    const keyValue = item[xKey]
    if (keyValue && typeof keyValue === 'string' && keyValue.length > 20) {
      newItem[xKey] = keyValue.substring(0, 20) + '...'
    }
    // Si el xKey es "No. Ruta", también crear una clave "Ruta" para consistencia
    if (xKey === "No. Ruta" && !newItem.Ruta) {
      newItem.Ruta = newItem[xKey]
    }
    return newItem
  })

  return (
    <div className="chart-card">
      <h4>{title}</h4>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          {type === 'line' ? (
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xKey} 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                style={{ fontSize: '12px' }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((yKey, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={yKey.key}
                  stroke={yKey.color}
                  name={yKey.label}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xKey} 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                style={{ fontSize: '12px' }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((yKey, index) => (
                <Bar
                  key={index}
                  dataKey={yKey.key}
                  fill={yKey.color}
                  name={yKey.label}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {data.length > 30 && (
        <p className="chart-note">Mostrando las primeras 30 rutas de {data.length} totales</p>
      )}
    </div>
  )
}

export default ChartCard

