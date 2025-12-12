import React from 'react'
import './DateFilter.css'

function DateFilter({ selectedDate, dates, onDateChange, showHolidayWarning }) {
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-')
    const date = new Date(year, month - 1, day)
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return `${dayNames[date.getDay()]} ${day}/${month}`
  }

  return (
    <div className="date-filter">
      <label htmlFor="date-select">Filtrar por fecha: </label>
      <select 
        id="date-select" 
        value={selectedDate} 
        onChange={(e) => onDateChange(e.target.value)}
        className="date-select"
      >
        <option value="all">Todos los días</option>
        {dates.map(date => (
          <option key={date} value={date}>
            {formatDate(date)} {date === '2025-12-08' && '(Festivo)'}
          </option>
        ))}
      </select>
      {showHolidayWarning && (
        <span className="holiday-warning">⚠️ Día festivo - Datos limitados</span>
      )}
    </div>
  )
}

export default DateFilter

