# Informes Sunshine - Dashboard de Métricas

Sistema de visualización de métricas para Finca Laureles y Finca Yarumo basado en datos de Excel.

🌐 **Sitio en vivo**: [Ver en GitHub Pages](https://juanes1203.github.io/InformesSunshine/)

## Requisitos

- Python 3.9+
- Node.js 18+
- npm o yarn

## Instalación

### Backend (Python/Flask) - Opcional para desarrollo local

```bash
pip install -r requirements.txt
```

### Frontend (React)

```bash
npm install
```

## Uso

### Modo Producción (GitHub Pages - Sin Backend)

Los datos se generan estáticamente. Para actualizar los datos:

```bash
python3 generate_static_data.py
```

Luego el sitio se construye y despliega automáticamente en GitHub Pages.

### Modo Desarrollo Local

#### 1. Generar datos estáticos (primera vez)

```bash
python3 generate_static_data.py
```

#### 2. Opción A: Solo Frontend (usa datos estáticos)

```bash
npm run dev
```

#### 2. Opción B: Con Backend Flask

En una terminal:
```bash
python app.py
```

El servidor se ejecutará en `http://localhost:5001` (puerto 5001 porque macOS usa el 5000 para AirPlay)

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

## Deploy en GitHub Pages

Para hacer deploy en GitHub Pages, ver las instrucciones en [DEPLOY.md](DEPLOY.md)

### Pasos rápidos:

1. Crear repositorio en GitHub: `InformesSunshine`
2. Conectar y hacer push:
   ```bash
   git remote add origin https://github.com/Juanes1203/InformesSunshine.git
   git push -u origin main
   ```
3. Habilitar GitHub Pages en Settings → Pages → Source: GitHub Actions
4. El sitio estará disponible en: https://juanes1203.github.io/InformesSunshine/

## Estructura del Proyecto

```
InformesSunshine/
├── app.py                    # Servidor Flask backend (opcional)
├── process_data.py           # Script de procesamiento de Excel
├── generate_static_data.py   # Genera JSON estáticos para GitHub Pages
├── requirements.txt          # Dependencias Python
├── package.json              # Dependencias Node.js
├── vite.config.js            # Configuración Vite
├── index.html                # HTML principal
├── public/
│   └── data/                 # Datos JSON estáticos
│       ├── laureles.json
│       └── yarumo.json
├── src/
│   ├── main.jsx              # Punto de entrada React
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos principales
│   └── components/
│       ├── FincaDashboard.jsx    # Dashboard de métricas
│       ├── MetricCard.jsx        # Tarjeta de métrica individual
│       ├── ChartCard.jsx         # Componente de gráficos
│       └── LoadingSpinner.jsx    # Spinner de carga
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions para deploy automático
├── FincaLaureles.xlsx        # Datos de Finca Laureles
└── FincaYarumo.xlsx          # Datos de Finca Yarumo
```

## Notas

- Los datos se procesan desde los archivos Excel y se generan archivos JSON estáticos.
- El sitio funciona completamente sin backend (solo archivos estáticos) en producción.
- El backend Flask es opcional y solo necesario para desarrollo local.
- Solo se muestran métricas para las cuales hay datos disponibles.

