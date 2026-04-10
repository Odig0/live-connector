#!/bin/bash
# Quick Start Script - PostgreSQL + Docker + TikTok Live Connector
# 
# Uso: bash start-postgres.sh
# O en Windows: ejecuta manualmente los comandos

set -e

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  🚀 TikTok Live Connector - PostgreSQL Setup                       ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar Docker
echo -e "${BLUE}1️⃣  Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado. Descárgalo desde https://www.docker.com${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker encontrado: $(docker --version)${NC}"
echo ""

# 2. Verificar Docker Compose
echo -e "${BLUE}2️⃣  Verificando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose encontrado: $(docker-compose --version)${NC}"
echo ""

# 3. Verificar Node.js
echo -e "${BLUE}3️⃣  Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Descárgalo desde https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"
echo ""

# 4. Instalar dependencias npm
echo -e "${BLUE}4️⃣  Instalando dependencias npm...${NC}"
npm install
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# 5. Iniciar PostgreSQL
echo -e "${BLUE}5️⃣  Iniciando PostgreSQL en Docker...${NC}"
docker-compose up -d postgres
echo -e "${GREEN}✅ PostgreSQL iniciado${NC}"
sleep 3
echo ""

# 6. Iniciar pgAdmin
echo -e "${BLUE}6️⃣  Iniciando pgAdmin...${NC}"
docker-compose up -d pgadmin
echo -e "${GREEN}✅ pgAdmin iniciado${NC}"
echo ""

# 7. Esperar a que PostgreSQL esté listo
echo -e "${BLUE}7️⃣  Esperando a que PostgreSQL esté listo...${NC}"
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL está listo${NC}"
        break
    fi
    echo "   Intento $i/30..."
    sleep 1
done
echo ""

# 8. Ejecutar pruebas
echo -e "${BLUE}8️⃣  Ejecutando pruebas de conexión...${NC}"
node test-database.js
echo ""

# 9. Mostrar información final
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ ¡CONFIGURACIÓN COMPLETADA!                                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📊 Acceso a los servicios:${NC}"
echo ""
echo -e "  ${BLUE}🗄️  PostgreSQL${NC}"
echo "     Host: localhost"
echo "     Puerto: 5432"
echo "     Usuario: postgres"
echo "     Contraseña: postgres123"
echo "     BD: tiktok_live_db"
echo ""
echo -e "  ${BLUE}🌐 pgAdmin (Interfaz Web)${NC}"
echo "     URL: http://localhost:5050"
echo "     Email: admin@admin.com"
echo "     Contraseña: admin"
echo ""
echo -e "  ${BLUE}🎬 API${NC}"
echo "     URL: http://localhost:3000"
echo "     Endpoint: http://localhost:3000/api/views"
echo ""
echo -e "${YELLOW}📋 Comandos útiles:${NC}"
echo ""
echo "  # Ver status de los servicios"
echo "  docker-compose ps"
echo ""
echo "  # Ver logs"
echo "  docker-compose logs -f postgres"
echo ""
echo "  # Detener servicios"
echo "  docker-compose down"
echo ""
echo "  # Ejecutar pruebas"
echo "  node test-database.js"
echo ""
echo -e "${YELLOW}📚 Documentación:${NC}"
echo "  • Lee DATABASE_SETUP.md para más detalles"
echo "  • Lee Dockploy docs para deploy remoto"
echo ""
