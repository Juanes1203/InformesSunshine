#!/bin/bash

# Script para iniciar tanto el backend como el frontend

echo "🚀 Iniciando servidores de Informes Sunshine..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

# Verificar si Node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Instalar dependencias Python si es necesario
if [ ! -d "venv" ]; then
    echo "📦 Instalando dependencias Python..."
    pip3 install -r requirements.txt
fi

# Instalar dependencias Node si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias Node..."
    npm install
fi

echo ""
echo "✅ Dependencias instaladas"
echo ""
echo "📊 Iniciando backend en puerto 5000..."
python3 app.py &
BACKEND_PID=$!

sleep 2

echo "🎨 Iniciando frontend en puerto 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener los servidores"

# Esperar a que el usuario presione Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

