from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from process_data import process_finca_data
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Cache para almacenar métricas
metrics_cache = {}

def get_metrics(finca_name):
    """Obtiene las métricas de una finca, usando cache si está disponible"""
    if finca_name not in metrics_cache:
        excel_file = 'FincaLaureles.xlsx' if finca_name == 'Laureles' else 'FincaYarumo.xlsx'
        metrics_cache[finca_name] = process_finca_data(excel_file, finca_name)
    return metrics_cache[finca_name]

@app.route('/api/metrics/<finca>', methods=['GET'])
def get_finca_metrics(finca):
    """Endpoint para obtener todas las métricas de una finca"""
    try:
        if finca not in ['Laureles', 'Yarumo']:
            return jsonify({'error': 'Finca no válida'}), 400
        
        metrics = get_metrics(finca)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/personas-inscritas-vs-abordaron', methods=['GET'])
def get_personas_inscritas_vs_abordaron(finca):
    """Endpoint para métrica 1: Personas inscritas vs personas que abordaron"""
    try:
        metrics = get_metrics(finca)
        return jsonify({
            'total_inscritas': metrics.get('total_personas_inscritas', 0),
            'total_abordaron': metrics.get('total_personas_abordaron', 0),
            'detalle': metrics.get('personas_inscritas_vs_abordaron', [])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/personas-vs-capacidad', methods=['GET'])
def get_personas_vs_capacidad(finca):
    """Endpoint para métrica 2: Personas que abordaron vs capacidad de bus"""
    try:
        metrics = get_metrics(finca)
        return jsonify(metrics.get('personas_vs_capacidad', []))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/rutas-problemas', methods=['GET'])
def get_rutas_problemas(finca):
    """Endpoint para métrica 3: Rutas con problemas"""
    try:
        metrics = get_metrics(finca)
        return jsonify(metrics.get('rutas_con_problemas', []))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/rutas-creadas-vs-iniciadas', methods=['GET'])
def get_rutas_creadas_vs_iniciadas(finca):
    """Endpoint para métrica 4: Rutas creadas vs iniciadas"""
    try:
        metrics = get_metrics(finca)
        return jsonify({
            'creadas': metrics.get('rutas_creadas', 0),
            'iniciadas': metrics.get('rutas_iniciadas', 0),
            'detalle': metrics.get('rutas_iniciadas_detalle', [])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/llegadas-y-salidas', methods=['GET'])
def get_llegadas_y_salidas(finca):
    """Endpoint para métrica 5: Personas que llegaron vs se fueron"""
    try:
        metrics = get_metrics(finca)
        return jsonify({
            'llegaron': metrics.get('personas_llegaron', 0),
            'se_fueron': metrics.get('personas_se_fueron', 0)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/pasajeros-adicionales', methods=['GET'])
def get_pasajeros_adicionales(finca):
    """Endpoint para métrica 6: Pasajeros adicionales"""
    try:
        metrics = get_metrics(finca)
        return jsonify(metrics.get('pasajeros_adicionales', {}))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/tiempo-viaje', methods=['GET'])
def get_tiempo_viaje(finca):
    """Endpoint para métrica 7: Promedio de tiempo de viaje"""
    try:
        metrics = get_metrics(finca)
        return jsonify(metrics.get('promedio_tiempo_viaje', {}))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics/<finca>/por-fecha', methods=['GET'])
def get_por_fecha(finca):
    """Endpoint para obtener métricas por fecha"""
    try:
        metrics = get_metrics(finca)
        return jsonify(metrics.get('por_fecha', {}))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fincas', methods=['GET'])
def get_fincas():
    """Endpoint para listar las fincas disponibles"""
    return jsonify(['Laureles', 'Yarumo'])

if __name__ == '__main__':
    import os
    # Cambiar a puerto 5001 porque macOS usa el 5000 para AirPlay
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '0.0.0.0')
    print(f"🚀 Servidor Flask iniciado en http://{host}:{port}")
    print(f"📊 Endpoints disponibles:")
    print(f"   - http://localhost:{port}/api/fincas")
    print(f"   - http://localhost:{port}/api/metrics/Laureles")
    print(f"   - http://localhost:{port}/api/metrics/Yarumo")
    app.run(debug=True, host=host, port=port, threaded=True)

