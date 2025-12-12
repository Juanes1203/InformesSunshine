import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Usar el base path para GitHub Pages
const basename = import.meta.env.BASE_URL || '/InformesSunshine'

// Manejar redirección desde 404.html (GitHub Pages)
const redirectRoute = sessionStorage.getItem('redirectRoute')
if (redirectRoute) {
  sessionStorage.removeItem('redirectRoute')
  // React Router manejará esta navegación después de que se monte
  window.__REACT_ROUTER_REDIRECT__ = redirectRoute
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

