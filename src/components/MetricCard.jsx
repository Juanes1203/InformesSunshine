import React from 'react'
import './MetricCard.css'

function MetricCard({ title, value, subtitle, color }) {
  return (
    <div className="metric-card" style={{ borderTopColor: color || '#667eea' }}>
      <h4>{title}</h4>
      <div className="metric-value" style={{ color: color || '#667eea' }}>
        {typeof value === 'number' ? value.toLocaleString('es-CO') : value}
      </div>
      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  )
}

export default MetricCard

