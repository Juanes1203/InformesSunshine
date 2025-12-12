import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer el index.html generado
const indexHtml = fs.readFileSync(join(__dirname, 'dist/index.html'), 'utf-8')

// Extraer los nombres de archivos de assets usando regex
const jsMatch = indexHtml.match(/src="([^"]*\.js)"/)
const cssMatch = indexHtml.match(/href="([^"]*\.css)"/)

const jsFile = jsMatch ? jsMatch[1] : null
const cssFile = cssMatch ? cssMatch[1] : null

if (!jsFile || !cssFile) {
  console.error('No se pudieron encontrar los archivos de assets')
  process.exit(1)
}

// Leer el template del 404.html
let html404 = fs.readFileSync(join(__dirname, 'public/404.html'), 'utf-8')

// Reemplazar los nombres de archivos
html404 = html404.replace(/src="[^"]*\.js"/, `src="${jsFile}"`)
html404 = html404.replace(/href="[^"]*\.css"/, `href="${cssFile}"`)

// Escribir el 404.html actualizado
fs.writeFileSync(join(__dirname, 'dist/404.html'), html404)

console.log(`✓ 404.html actualizado con: ${jsFile} y ${cssFile}`)

