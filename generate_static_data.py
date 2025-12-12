#!/usr/bin/env python3
"""Script para generar datos estáticos JSON para GitHub Pages"""
import json
from process_data import process_finca_data

def generate_static_data():
    """Genera archivos JSON estáticos para cada finca"""
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
            
            # Guardar JSON individual para cada finca
            output_file = f'public/data/{finca_name.lower()}.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(metrics, f, ensure_ascii=False, indent=2, default=str)
            print(f"✓ {finca_name} guardado en {output_file}")
            
        except Exception as e:
            print(f"✗ Error procesando {finca_name}: {e}")
            import traceback
            traceback.print_exc()
    
    # Guardar también un archivo consolidado
    with open('public/data/all_metrics.json', 'w', encoding='utf-8') as f:
        json.dump(all_metrics, f, ensure_ascii=False, indent=2, default=str)
    
    print("\n✅ Todos los datos estáticos generados en public/data/")
    return all_metrics

if __name__ == '__main__':
    import os
    # Crear directorio si no existe
    os.makedirs('public/data', exist_ok=True)
    generate_static_data()

