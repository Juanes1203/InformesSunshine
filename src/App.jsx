import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import FincaDashboard from './components/FincaDashboard'
import Welcome from './components/Welcome'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>🌻 Informes Sunshine</h1>
        </Link>
        <nav>
          <Link to="/laureles">Finca Laureles</Link>
          <Link to="/yarumo">Finca Yarumo</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/laureles" element={<FincaDashboard finca="Laureles" />} />
          <Route path="/yarumo" element={<FincaDashboard finca="Yarumo" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

