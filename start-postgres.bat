@echo off
REM Quick Start Script - PostgreSQL + Docker + TikTok Live Connector (Windows)
REM 
REM Uso: Abre PowerShell en la carpeta del proyecto y ejecuta:
REM      .\start-postgres.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║  🚀 TikTok Live Connector - PostgreSQL Setup (Windows)             ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM 1. Verificar Docker
echo [1/8] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado
    echo.
    echo Por favor descarga Docker desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
for /f "tokens=*" %%A in ('docker --version') do echo ✅ %%A
echo.

REM 2. Verificar Docker Compose
echo [2/8] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose no está disponible
    pause
    exit /b 1
)
for /f "tokens=*" %%A in ('docker-compose --version') do echo ✅ %%A
echo.

REM 3. Verificar Node.js
echo [3/8] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo.
    echo Por favor descarga Node.js desde: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%A in ('node --version') do echo ✅ Node.js %%A
echo.

REM 4. Instalar dependencias npm
echo [4/8] Instalando dependencias npm...
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

REM 5. Iniciar PostgreSQL
echo [5/8] Iniciando PostgreSQL en Docker...
call docker-compose up -d postgres
if errorlevel 1 (
    echo ❌ Error al iniciar PostgreSQL
    pause
    exit /b 1
)
echo ✅ PostgreSQL iniciado
timeout /t 3 /nobreak

REM 6. Iniciar pgAdmin
echo.
echo [6/8] Iniciando pgAdmin...
call docker-compose up -d pgadmin
if errorlevel 1 (
    echo ❌ Error al iniciar pgAdmin
    pause
    exit /b 1
)
echo ✅ pgAdmin iniciado
echo.

REM 7. Esperar a que PostgreSQL esté listo
echo [7/8] Esperando a que PostgreSQL esté listo...
set count=0
:wait_loop
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 0 (
    echo ✅ PostgreSQL está listo
    goto ready
)
set /a count=count+1
if %count% gtr 30 (
    echo ⚠️  PostgreSQL tardó demasiado, continuando...
    goto ready
)
echo    Intento %count%/30...
timeout /t 1 /nobreak >nul
goto wait_loop

:ready
echo.

REM 8. Ejecutar pruebas
echo [8/8] Ejecutando pruebas de conexión...
call node test-database.js
if errorlevel 1 (
    echo ⚠️  Error en las pruebas, pero la configuración está completa
)
echo.

REM Mostrar información final
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║  ✅ ¡CONFIGURACIÓN COMPLETADA!                                     ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
echo 📊 Acceso a los servicios:
echo.
echo   🗄️  PostgreSQL
echo      Host: localhost
echo      Puerto: 5432
echo      Usuario: postgres
echo      Contraseña: postgres123
echo      BD: tiktok_live_db
echo.
echo   🌐 pgAdmin (Interfaz Web)
echo      URL: http://localhost:5050
echo      Email: admin@admin.com
echo      Contraseña: admin
echo.
echo   🎬 API
echo      URL: http://localhost:3000
echo      Endpoint: http://localhost:3000/api/views
echo.
echo 📋 Comandos útiles:
echo.
echo   docker-compose ps              (Ver status de servicios)
echo   docker-compose logs -f         (Ver logs)
echo   docker-compose down            (Detener servicios)
echo   node test-database.js          (Ejecutar pruebas)
echo.
echo 📚 Documentación: Lee DATABASE_SETUP.md para más detalles
echo.
pause
