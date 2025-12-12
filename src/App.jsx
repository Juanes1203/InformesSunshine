import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import FincaDashboard from './components/FincaDashboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🌻 Informes Sunshine</h1>
        <nav>
          <Link to="/laureles">Finca Laureles</Link>
          <Link to="/yarumo">Finca Yarumo</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/laureles" replace />} />
          <Route path="/laureles" element={<FincaDashboard finca="Laureles" />} />
          <Route path="/yarumo" element={<FincaDashboard finca="Yarumo" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

