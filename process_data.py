import pandas as pd
import json
from datetime import datetime
from collections import defaultdict

def process_finca_data(excel_file, finca_name):
    """Procesa los datos de Excel y calcula todas las métricas posibles"""
    
    # Leer las hojas relevantes
    consolidado = pd.read_excel(excel_file, sheet_name='Consolidado')
    reporte_ruta = pd.read_excel(excel_file, sheet_name='Reporte por ruta')
    
    # Filtrar por fechas: 8-11 de diciembre de 2025
    target_dates = ['2025-12-08', '2025-12-09', '2025-12-10', '2025-12-11']
    consolidado['Fecha'] = pd.to_datetime(consolidado['Fecha']).dt.strftime('%Y-%m-%d')
    consolidado = consolidado[consolidado['Fecha'].isin(target_dates)]
    
    reporte_ruta['Fecha inicio'] = pd.to_datetime(reporte_ruta['Fecha inicio'], errors='coerce')
    reporte_ruta['Fecha fin'] = pd.to_datetime(reporte_ruta['Fecha fin'], errors='coerce')
    
    # Filtrar reporte por ruta por fechas
    reporte_ruta_filtered = reporte_ruta[
        (reporte_ruta['Fecha inicio'].dt.strftime('%Y-%m-%d').isin(target_dates)) |
        (reporte_ruta['Fecha fin'].dt.strftime('%Y-%m-%d').isin(target_dates))
    ]
    
    metrics = {}
    
    # 1. Personas inscritas vs personas que abordaron
    consolidado_clean = consolidado.dropna(subset=['Nombre Estudiante', 'No. Ruta'])
    personas_inscritas = consolidado_clean.groupby(['Fecha', 'No. Ruta'])['Código'].nunique().reset_index()
    personas_inscritas.columns = ['Fecha', 'Ruta', 'Inscritas']
    
    personas_abordaron = consolidado_clean[
        consolidado_clean['Estado'].isin(['Recogido', 'Entregado', 'Pasajero extra'])
    ].groupby(['Fecha', 'No. Ruta'])['Código'].nunique().reset_index()
    personas_abordaron.columns = ['Fecha', 'Ruta', 'Abordaron']
    
    metric1 = pd.merge(personas_inscritas, personas_abordaron, on=['Fecha', 'Ruta'], how='outer').fillna(0)
    metric1 = metric1.to_dict('records')
    metrics['personas_inscritas_vs_abordaron'] = metric1
    
    # Total general
    total_inscritas = consolidado_clean['Código'].nunique()
    total_abordaron = consolidado_clean[consolidado_clean['Estado'].isin(['Recogido', 'Entregado', 'Pasajero extra'])]['Código'].nunique()
    metrics['total_personas_inscritas'] = int(total_inscritas)
    metrics['total_personas_abordaron'] = int(total_abordaron)
    
    # 2. Personas que abordaron vs capacidad de bus (estimada)
    # Calcular capacidad por ruta individual (máximo de personas inscritas en esa ruta específica)
    capacidad_por_ruta_dict = consolidado_clean.groupby('No. Ruta')['Código'].nunique().to_dict()
    
    abordaron_por_ruta = consolidado_clean[
        consolidado_clean['Estado'].isin(['Recogido', 'Entregado', 'Pasajero extra'])
    ].groupby(['Fecha', 'No. Ruta'])['Código'].nunique().reset_index()
    abordaron_por_ruta.columns = ['Fecha', 'Ruta', 'Abordaron']
    
    # Asignar capacidad específica a cada ruta
    abordaron_por_ruta['Capacidad_estimada'] = abordaron_por_ruta['Ruta'].map(capacidad_por_ruta_dict).fillna(0).astype(int)
    abordaron_por_ruta['Porcentaje_ocupacion'] = (abordaron_por_ruta['Abordaron'] / abordaron_por_ruta['Capacidad_estimada'] * 100).round(2)
    # Manejar división por cero
    abordaron_por_ruta.loc[abordaron_por_ruta['Capacidad_estimada'] == 0, 'Porcentaje_ocupacion'] = 0
    
    metrics['personas_vs_capacidad'] = abordaron_por_ruta.to_dict('records')
    
    # 3. Persistencia: Rutas con problemas
    problemas_rutas = []
    for _, row in reporte_ruta_filtered.iterrows():
        problemas = []
        if pd.notna(row.get('Sospecha de ruta iniciada incorrectamente')):
            problemas.append('Iniciada incorrectamente')
        if pd.notna(row.get('Sospecha de ruta finalizada incorrectamente')):
            problemas.append('Finalizada incorrectamente')
        if pd.notna(row.get('Sospecha de mala marcación')):
            problemas.append('Mala marcación')
        
        if problemas:
            fecha_inicio = row['Fecha inicio'].strftime('%Y-%m-%d') if pd.notna(row['Fecha inicio']) else 'N/A'
            problemas_rutas.append({
                'Ruta': row['Ruta'],
                'Fecha': fecha_inicio,
                'Problemas': problemas,
                'Cantidad_problemas': len(problemas)
            })
    
    # Agrupar por ruta para contar problemas históricos
    problemas_por_ruta = defaultdict(int)
    problemas_detalle = defaultdict(list)
    for item in problemas_rutas:
        problemas_por_ruta[item['Ruta']] += item['Cantidad_problemas']
        problemas_detalle[item['Ruta']].append(item)
    
    metrics['rutas_con_problemas'] = [
        {'Ruta': ruta, 'Total_problemas': count, 'Detalles': problemas_detalle[ruta]}
        for ruta, count in problemas_por_ruta.items()
    ]
    
    # 4. Rutas creadas vs iniciadas
    rutas_unicas = consolidado_clean['No. Ruta'].unique()
    rutas_creadas = len(rutas_unicas)
    
    rutas_iniciadas = reporte_ruta_filtered['Ruta'].nunique()
    # Mapear nombres de rutas del reporte a números de ruta del consolidado
    rutas_iniciadas_list = reporte_ruta_filtered['Ruta'].unique().tolist()
    
    metrics['rutas_creadas'] = int(rutas_creadas)
    metrics['rutas_iniciadas'] = int(rutas_iniciadas)
    metrics['rutas_iniciadas_detalle'] = [{'Ruta': r} for r in rutas_iniciadas_list[:50]]  # Limitamos a 50
    
    # 5. Personas que llegaron vs se fueron en buses
    # Rutas AM (Recogido): Recogen estudiantes de sus casas y los llevan a la finca/colegio = LLEGAN a la finca
    # Rutas PM (Entregado): Entregan estudiantes de vuelta a sus casas desde la finca/colegio = SE VAN de la finca
    llegaron = consolidado_clean[consolidado_clean['Estado'] == 'Recogido']['Código'].nunique()
    se_fueron = consolidado_clean[consolidado_clean['Estado'] == 'Entregado']['Código'].nunique()
    
    metrics['personas_llegaron'] = int(llegaron)
    metrics['personas_se_fueron'] = int(se_fueron)
    
    # 6. Pasajeros adicionales
    pasajeros_extra = consolidado_clean[consolidado_clean['Estado'] == 'Pasajero extra']
    total_pasajeros_extra = len(pasajeros_extra)
    pasajeros_extra_por_ruta = pasajeros_extra.groupby(['Fecha', 'No. Ruta']).size().reset_index(name='Cantidad')
    metrics['pasajeros_adicionales'] = {
        'Total': int(total_pasajeros_extra),
        'Por_ruta': pasajeros_extra_por_ruta.to_dict('records')
    }
    
    # 7. Promedio de tiempo de viaje
    def tiempo_a_minutos(tiempo_str):
        """Convierte tiempo en formato HH:MM:SS a minutos"""
        if pd.isna(tiempo_str) or tiempo_str == '':
            return None
        try:
            if isinstance(tiempo_str, str) and ':' in tiempo_str:
                parts = tiempo_str.split(':')
                if len(parts) == 3:
                    horas, minutos, segundos = map(int, parts)
                    return horas * 60 + minutos + segundos / 60
            return None
        except:
            return None
    
    tiempos_ruta = reporte_ruta_filtered[['Ruta', 'Tiempo total ruta', 'Fecha inicio']].copy()
    tiempos_ruta['Tiempo_minutos'] = tiempos_ruta['Tiempo total ruta'].apply(tiempo_a_minutos)
    tiempos_ruta_clean = tiempos_ruta.dropna(subset=['Tiempo_minutos'])
    
    if len(tiempos_ruta_clean) > 0:
        promedio_tiempo = tiempos_ruta_clean['Tiempo_minutos'].mean()
        tiempos_por_ruta = tiempos_ruta_clean.copy()
        tiempos_por_ruta['Fecha inicio'] = tiempos_por_ruta['Fecha inicio'].dt.strftime('%Y-%m-%d')
        metrics['promedio_tiempo_viaje'] = {
            'Promedio_minutos': round(float(promedio_tiempo), 2),
            'Por_ruta': tiempos_por_ruta[['Ruta', 'Fecha inicio', 'Tiempo total ruta', 'Tiempo_minutos']].rename(columns={'Tiempo_minutos': 'Tiempo_minutos'}).to_dict('records')
        }
    else:
        metrics['promedio_tiempo_viaje'] = {
            'Promedio_minutos': 0,
            'Por_ruta': []
        }
    
    # Datos adicionales por fecha
    metrics['por_fecha'] = {}
    for fecha in target_dates:
        fecha_data = consolidado_clean[consolidado_clean['Fecha'] == fecha]
        if len(fecha_data) > 0:
            metrics['por_fecha'][fecha] = {
                'inscritas': int(fecha_data['Código'].nunique()),
                'abordaron': int(fecha_data[fecha_data['Estado'].isin(['Recogido', 'Entregado', 'Pasajero extra'])]['Código'].nunique()),
                'llegaron': int(fecha_data[fecha_data['Estado'] == 'Recogido']['Código'].nunique()),
                'se_fueron': int(fecha_data[fecha_data['Estado'] == 'Entregado']['Código'].nunique()),
                'pasajeros_extra': int(len(fecha_data[fecha_data['Estado'] == 'Pasajero extra']))
            }
    
    return metrics

if __name__ == '__main__':
    # Procesar ambas fincas
    fincas = {
        'Laureles': 'FincaLaureles.xlsx',
        'Yarumo': 'FincaYarumo.xlsx'
    }
    
    all_metrics = {}
    for finca_name, excel_file in fincas.items():
        print(f"Procesando {finca_name}...")
        try:
            metrics = process_finca_data(excel_file, finca_name)
            all_metrics[finca_name] = metrics
            print(f"✓ {finca_name} procesado exitosamente")
        except Exception as e:
            print(f"✗ Error procesando {finca_name}: {e}")
            import traceback
            traceback.print_exc()
    
    # Guardar en JSON para referencia
    with open('metrics.json', 'w', encoding='utf-8') as f:
        json.dump(all_metrics, f, ensure_ascii=False, indent=2, default=str)
    
    print("\nMétricas calculadas y guardadas en metrics.json")

