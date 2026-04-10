#!/bin/bash
# Script rápido para probar la API
# Uso: bash test-live-api.sh

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🧪 Pruebas de API - Live Count                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000"

# 1. Health check
echo "1️⃣  Verificando conexión a BD..."
curl -s -X GET "$BASE_URL/api/live/health" | jq .
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# 2. Crear un registro
echo "2️⃣  Creando un registro..."
curl -s -X POST "$BASE_URL/api/live/create" \
  -H "Content-Type: application/json" \
  -d '{"channel_name":"El Deber","platform":"tiktok","view_count":2500}' | jq .
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# 3. Crear múltiples
echo "3️⃣  Creando 5 registros aleatorios..."
curl -s -X POST "$BASE_URL/api/live/create-multiple" \
  -H "Content-Type: application/json" \
  -d '{"count":5}' | jq '.count'
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# 4. Obtener todos
echo "4️⃣  Obteniendo todos los registros..."
curl -s -X GET "$BASE_URL/api/live/all" | jq '.data[0:3]'
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

# 5. Por plataforma
echo "5️⃣  Registros de TikTok..."
curl -s -X GET "$BASE_URL/api/live/platform/tiktok" | jq '.count'
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

echo "✅ Pruebas completadas"
echo ""
