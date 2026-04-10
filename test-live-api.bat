@echo off
REM Script rápido para probar la API (Windows)
REM Uso: test-live-api.bat

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🧪 Pruebas de API - Live Count (Windows)              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set BASE_URL=http://localhost:3000

echo 1️⃣  Verificando conexión a BD...
curl -s -X GET "%BASE_URL%/api/live/health"
echo.
echo.

echo 2️⃣  Creando un registro...
curl -s -X POST "%BASE_URL%/api/live/create" ^
  -H "Content-Type: application/json" ^
  -d "{\"channel_name\":\"El Deber\",\"platform\":\"tiktok\",\"view_count\":2500}"
echo.
echo.

echo 3️⃣  Creando 5 registros aleatorios...
curl -s -X POST "%BASE_URL%/api/live/create-multiple" ^
  -H "Content-Type: application/json" ^
  -d "{\"count\":5}"
echo.
echo.

echo 4️⃣  Obteniendo todos los registros...
curl -s -X GET "%BASE_URL%/api/live/all"
echo.
echo.

echo ✅ Pruebas completadas
echo.
pause
