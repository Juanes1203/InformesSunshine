import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Usar el base path para GitHub Pages
const basename = import.meta.env.BASE_URL || '/InformesSunshine'

// Manejar redirección desde 404.html
if (window.location.hash && window.location.hash.startsWith('#/')) {
  const route = window.location.hash.substring(1)
  window.history.replaceState(null, '', basename + route)
  window.location.hash = ''
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

