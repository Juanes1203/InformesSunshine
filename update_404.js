import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Leer el index.html generado
const indexHtmlPath = path.join(__dirname, 'dist/index.html')
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')

// Script de redirección para GitHub Pages
const redirectScript = `
    <script>
      // GitHub Pages 404 handler - Redirigir a index.html manteniendo la ruta
      (function() {
        var path = window.location.pathname;
        var basePath = '/InformesSunshine';
        
        // Si estamos en una ruta que no es index.html, redirigir
        if (!path.endsWith('/index.html') && path.startsWith(basePath)) {
          var route = path.replace(basePath, '') || '/';
          // Redirigir a index.html y luego React Router manejará la ruta
          window.history.replaceState(null, '', basePath + '/index.html');
          // Establecer la ruta en sessionStorage para que React Router la lea
          sessionStorage.setItem('redirectRoute', route);
        }
      })();
    </script>`

// Insertar el script antes del cierre de </head>
const html404 = indexHtml.replace('</head>', redirectScript + '</head>')

// Escribir el 404.html
const html404Path = path.join(__dirname, 'dist/404.html')
fs.writeFileSync(html404Path, html404)

console.log('✓ 404.html generado correctamente desde index.html')

