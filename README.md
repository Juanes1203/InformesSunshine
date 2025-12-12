# Informes Sunshine - Dashboard de Métricas

Sistema de visualización de métricas para Finca Laureles y Finca Yarumo basado en datos de Excel.

## Requisitos

- Python 3.9+
- Node.js 18+
- npm o yarn

## Instalación

### Backend (Python/Flask)

```bash
pip install -r requirements.txt
```

### Frontend (React)

```bash
npm install
```

## Uso

### 1. Iniciar el servidor backend

```bash
python app.py
```

El servidor se ejecutará en `http://localhost:5001` (puerto 5001 porque macOS usa el 5000 para AirPlay)

### 2. Iniciar el servidor frontend

En otra terminal:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Métricas Disponibles

1. **Personas inscritas vs personas que abordaron**: Comparación entre el total de personas inscritas y las que realmente abordaron los buses.

2. **Personas que abordaron vs capacidad de bus**: Análisis de ocupación de los buses por ruta.

3. **Persistencia - Rutas con problemas**: Identificación de rutas que tuvieron problemas (iniciadas/finalizadas incorrectamente, mala marcación) con historial.

4. **Rutas creadas vs rutas iniciadas**: Comparación entre el total de rutas creadas y las que fueron realmente iniciadas.

5. **Personas que llegaron vs se fueron**: Conteo de personas que llegaron a la finca (Entregado) y las que se fueron (Recogido).

6. **Pasajeros adicionales**: Conteo de pasajeros extra que no estaban originalmente inscritos.

7. **Promedio de tiempo de viaje**: Tiempo promedio de viaje por ruta calculado en minutos.

## Período de Análisis

Las métricas se calculan para el período del **8 al 11 de diciembre de 2025**.

## Estructura del Proyecto

```
InformesSunshine/
├── app.py                    # Servidor Flask backend
├── process_data.py           # Script de procesamiento de Excel
├── requirements.txt          # Dependencias Python
├── package.json              # Dependencias Node.js
├── vite.config.js            # Configuración Vite
├── index.html                # HTML principal
├── src/
│   ├── main.jsx              # Punto de entrada React
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos principales
│   └── components/
│       ├── FincaDashboard.jsx    # Dashboard de métricas
│       ├── MetricCard.jsx        # Tarjeta de métrica individual
│       ├── ChartCard.jsx         # Componente de gráficos
│       └── LoadingSpinner.jsx    # Spinner de carga
├── FincaLaureles.xlsx        # Datos de Finca Laureles
└── FincaYarumo.xlsx          # Datos de Finca Yarumo
```

## Notas

- Los datos se procesan en tiempo real desde los archivos Excel.
- El backend tiene un sistema de caché para optimizar las consultas.
- Solo se muestran métricas para las cuales hay datos disponibles.

