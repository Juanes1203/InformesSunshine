# Solución para Ver Capacidades Corregidas

## Problema
El navegador está mostrando capacidades antiguas (60/40) porque está cacheando los archivos JSON.

## Solución

### 1. Limpiar Caché del Navegador
**Chrome/Edge:**
- Presiona `Ctrl+Shift+Delete` (Windows) o `Cmd+Shift+Delete` (Mac)
- Selecciona "Cached images and files"
- Período: "Last 24 hours" o "All time"
- Click en "Clear data"

**O usar modo incógnito:**
- `Ctrl+Shift+N` (Windows) o `Cmd+Shift+N` (Mac)
- Abre: https://juanes1203.github.io/InformesSunshine/

### 2. Forzar Recarga de Datos
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Marca la casilla **"Disable cache"**
4. Mantén abierta la pestaña Network
5. Recarga la página con `Ctrl+Shift+R` o `Cmd+Shift+R`

### 3. Verificar que se Cargaron los Datos Correctos
En la consola del navegador (F12 → Console), deberías ver:
```
Cargando datos estáticos desde: /InformesSunshine/data/laureles.json
```

Luego verifica en Network que el archivo `laureles.json` o `yarumo.json` tenga una fecha reciente.

### 4. Verificar Capacidades en la Consola
Abre la consola (F12) y ejecuta:
```javascript
// Esto mostrará las capacidades únicas en los datos cargados
fetch('/InformesSunshine/data/laureles.json')
  .then(r => r.json())
  .then(data => {
    const capacidades = [...new Set(data.personas_vs_capacidad.map(x => x.Capacidad_estimada))];
    console.log('Capacidades únicas:', capacidades.sort((a,b) => a-b));
  });
```

Deberías ver: `[11, 15, 19, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 44, 46, 47, 48, 57, 60]`

## Nota
Los datos ahora tienen capacidades individuales por ruta:
- **Laureles**: Capacidades variadas entre 11 y 60
- **Yarumo**: Capacidades variadas entre 13 y 41

Cada ruta tiene su propia capacidad basada en el máximo de personas inscritas en esa ruta específica.

