# Instrucciones para Ejecutar la Aplicación

## Problema Resuelto
El error 403 Forbidden se debía a que macOS usa el puerto 5000 para AirPlay. **El backend ahora se ejecuta en el puerto 5001**.

## Pasos para Ejecutar

### 1. Iniciar el Backend (Terminal 1)
```bash
cd /Users/juanes/Desktop/InformesSunshine
python3 app.py
```

Deberías ver:
```
🚀 Servidor Flask iniciado en http://0.0.0.0:5001
📊 Endpoints disponibles:
   - http://localhost:5001/api/fincas
   - http://localhost:5001/api/metrics/Laureles
   - http://localhost:5001/api/metrics/Yarumo
```

### 2. Iniciar el Frontend (Terminal 2)
En una nueva terminal:
```bash
cd /Users/juanes/Desktop/InformesSunshine
npm run dev
```

### 3. Abrir el Navegador
Abre tu navegador en: **http://localhost:3000**

## Scripts Alternativos

### Solo Backend
```bash
./start_backend.sh
```

### Ambos (Backend + Frontend)
```bash
./start.sh
```

## Verificar que Funciona

Puedes probar el backend directamente:
```bash
curl http://localhost:5001/api/fincas
```

Debería devolver: `["Laureles","Yarumo"]`

## Nota Importante
- **Backend**: Puerto **5001** (no 5000, porque macOS lo usa para AirPlay)
- **Frontend**: Puerto **3000**
- El proxy de Vite está configurado para redirigir `/api/*` al puerto 5001

