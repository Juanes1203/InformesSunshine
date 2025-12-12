# Verificar Capacidades de Yarumo

## Estado Actual

Los datos de Yarumo están **correctos** y tienen capacidades variadas:
- Capacidades únicas: [13, 16, 19, 20, 21, 22, 23, 25, 26, 27, 30, 31, 32, 33, 35, 38, 39, 41]
- Solo 4 rutas tienen capacidad 41 (máximo)
- Las demás rutas tienen capacidades menores (13-39)

## Si Ves Todas las Capacidades en 41

El problema es **caché del navegador**. Los datos JSON están correctos, pero tu navegador está usando una versión antigua.

### Solución 1: Limpiar Caché Completo

1. Abre las herramientas de desarrollador (F12)
2. Click derecho en el botón de recargar (🔄) en la barra de navegación
3. Selecciona **"Vaciar caché y volver a cargar de forma forzada"** o **"Empty Cache and Hard Reload"**

### Solución 2: Modo Incógnito

1. Abre una ventana incógnita: `Ctrl+Shift+N` (Windows) o `Cmd+Shift+N` (Mac)
2. Ve a: https://juanes1203.github.io/InformesSunshine/
3. Navega a Yarumo

### Solución 3: Limpiar Caché Manualmente

**Chrome/Edge:**
1. `Ctrl+Shift+Delete` (Windows) o `Cmd+Shift+Delete` (Mac)
2. Selecciona "Cached images and files"
3. Período: "Last 24 hours" o "All time"
4. Click "Clear data"

### Solución 4: Verificar en la Consola

Abre la consola (F12 → Console) y ejecuta:

```javascript
fetch('/InformesSunshine/data/yarumo.json')
  .then(r => r.json())
  .then(data => {
    const capacidades = [...new Set(data.personas_vs_capacidad.map(x => x.Capacidad_estimada))];
    console.log('Capacidades únicas en Yarumo:', capacidades.sort((a,b) => a-b));
    console.log('Total rutas:', data.personas_vs_capacidad.length);
  });
```

**Deberías ver:** Capacidades variadas, NO solo 41.

### Solución 5: Verificar en Network

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Marca **"Disable cache"**
4. Recarga la página
5. Busca `yarumo.json` en la lista
6. Haz click en él
7. Ve a la pestaña **Preview** o **Response**
8. Verifica que las capacidades sean variadas

## Datos Esperados

**Ejemplos de rutas con diferentes capacidades:**
- FACATATIVA(AER)R1 AM: 16
- FACATATIVA(AER)R2 AM: 25
- FACATATIVA(AER)R4 PM: 30
- MADRID(AER)R3 AM: 33
- ROSAL(AER)R4 AM: 41 (solo algunas rutas tienen 41)

