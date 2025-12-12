#!/bin/bash

# Script para iniciar solo el backend

echo "🚀 Iniciando backend Flask..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

# Verificar si las dependencias están instaladas
python3 -c "import flask, flask_cors, pandas, openpyxl" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Instalando dependencias Python..."
    pip3 install -r requirements.txt
fi

# Verificar si el puerto 5001 está en uso
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 5001 ya está en uso. Deteniendo procesos anteriores..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "✅ Iniciando servidor en http://localhost:5001"
echo ""
python3 app.py

