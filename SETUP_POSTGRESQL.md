╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║         🎬 TikTok Live Connector - Configuración PostgreSQL + Docker          ║
║                                                                              ║
║                    ✅ SETUP COMPLETADO CON ÉXITO                            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 ARCHIVOS CREADOS:
═════════════════════════════════════════════════════════════════════════════

1. CONFIGURACIÓN DE DOCKER:
   ├── docker-compose.yml ..................... Configura PostgreSQL y pgAdmin
   ├── docker-compose.prod.yml ............... Versión con app incluida
   └── Dockerfile ............................ Para containerizar la aplicación

2. BASE DE DATOS:
   ├── init-db.sql .......................... Script SQL con todas las tablas
   ├── config/database.js ................... Módulo de conexión a PostgreSQL
   └── config/db-helpers.js ................. Funciones auxiliares

3. TESTING Y VALIDACIÓN:
   ├── test-database.js ..................... Script para probar la conexión
   └── test-database.js ..................... Crea registros y eventos de prueba

4. STARTUP SCRIPTS:
   ├── start-postgres.sh .................... Bash script (Linux/Mac)
   └── start-postgres.bat ................... Batch script (Windows)

5. DEPLOY:
   ├── dockploy.json ........................ Configuración para Dockploy
   └── DATABASE_SETUP.md .................... Documentación completa

6. CONFIGURACIÓN:
   └── .env ................................ Variables de entorno actualizadas

7. DEPENDENCIAS:
   └── package.json ......................... Agreguada librería `pg`

═════════════════════════════════════════════════════════════════════════════

📊 ESTRUCTURA DE TABLAS CREADAS:
═════════════════════════════════════════════════════════════════════════════

✅ live_count
   └─ Almacena información de transmisiones en vivo
   └─ 20 campos incluyendo vistas, likes, comentarios, regalos
   └─ Timestamps automáticos (created_at, updated_at, ended_at)

✅ live_events
   └─ Registra eventos individuales (comentarios, regalos, etc.)
   └─ Referencia cruzada con live_count
   └─ Tipos: comment, like, share, gift, join, leave

✅ channel_config
   └─ Configuración de canales (TikTok, Facebook, YouTube)
   └─ Incluye canales por defecto (Unitel, Bolivisión, El Deber)

✅ current_live_stats (Vista)
   └─ Estadísticas en tiempo real de transmisiones activas
   └─ Cuenta eventos agrupados por tipo

✅ update_updated_at_column (Función)
   └─ Actualiza automáticamente timestamps

═════════════════════════════════════════════════════════════════════════════

🚀 CÓMO INICIAR:
═════════════════════════════════════════════════════════════════════════════

OPCIÓN 1: Script automático (RECOMENDADO)
─────────────────────────────────────────
Windows:
   1. Abre PowerShell en la carpeta del proyecto
   2. Ejecuta: .\start-postgres.bat
   3. ¡Listo!

Linux/Mac:
   1. Abre terminal en la carpeta del proyecto
   2. Ejecuta: bash start-postgres.sh
   3. ¡Listo!

OPCIÓN 2: Comando manual
─────────────────────────
   1. npm install
   2. docker-compose up -d
   3. node test-database.js

═════════════════════════════════════════════════════════════════════════════

📱 ACCESO A SERVICIOS:
═════════════════════════════════════════════════════════════════════════════

🗄️  PostgreSQL (Conexión directa)
    ├─ Host: localhost
    ├─ Puerto: 5432
    ├─ Usuario: postgres
    ├─ Contraseña: postgres123
    └─ BD: tiktok_live_db

🌐 pgAdmin (Interfaz Web para PostgreSQL)
    ├─ URL: http://localhost:5050
    ├─ Email: admin@admin.com
    ├─ Contraseña: admin
    └─ Instrucciones: Usa "postgres" como host de DB

🎬 API TikTok Live Connector
    ├─ URL: http://localhost:3000
    └─ Endpoint: http://localhost:3000/api/views

═════════════════════════════════════════════════════════════════════════════

💻 EJEMPLOS DE USO EN TU CÓDIGO:
═════════════════════════════════════════════════════════════════════════════

CREAR UNA TRANSMISIÓN:
─────────────────────
const dbHelpers = require('./config/db-helpers');

const live = await dbHelpers.createLiveCount({
  channel_name: 'El Deber',
  platform: 'tiktok',
  view_count: 1000,
  is_live: true,
});

REGISTRAR EVENTOS:
──────────────────
await dbHelpers.recordEvent(live.id, {
  event_type: 'comment',
  user_nickname: 'Juan',
  content: '¡Gran transmisión!',
});

ACTUALIZAR VISTAS:
──────────────────
await dbHelpers.updateLiveCount(live.id, {
  view_count: 5000,
  concurrent_viewers: 1200,
});

OBTENER ESTADÍSTICAS:
─────────────────────
const stats = await dbHelpers.getLiveSummary('El Deber', 'tiktok');

FINALIZAR TRANSMISIÓN:
──────────────────────
await dbHelpers.endLiveStream(live.id);

═════════════════════════════════════════════════════════════════════════════

🔧 VARIABLES DE ENTORNO (.env):
═════════════════════════════════════════════════════════════════════════════

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=tiktok_live_db
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tiktok_live_db

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

═════════════════════════════════════════════════════════════════════════════

📋 COMANDOS DOCKER ÚTILES:
═════════════════════════════════════════════════════════════════════════════

Ver estado de servicios:
   docker-compose ps

Ver logs:
   docker-compose logs -f postgres
   docker-compose logs -f pgadmin

Acceder a PostgreSQL desde terminal:
   docker-compose exec postgres psql -U postgres -d tiktok_live_db

Hacer backup:
   docker-compose exec postgres pg_dump -U postgres tiktok_live_db > backup.sql

Restaurar backup:
   docker-compose exec -T postgres psql -U postgres tiktok_live_db < backup.sql

Detener servicios:
   docker-compose down

Detener y eliminar volúmenes (¡BORRA DATOS!):
   docker-compose down -v

═════════════════════════════════════════════════════════════════════════════

🌐 DEPLOY CON DOCKPLOY:
═════════════════════════════════════════════════════════════════════════════

1. Instala Dockploy:
   npm install -g dockploy

2. Edita dockploy.json con tus datos del servidor:
   - host: tu servidor
   - username: usuario del servidor
   - privateKey: tu clave SSH
   - remotePath: ruta en el servidor

3. Ejecuta el deploy:
   dockploy deploy --config dockploy.json

4. Verificar en el servidor:
   ssh user@your-server
   cd /home/deploy/apps/tiktok-live-connector
   docker-compose ps

═════════════════════════════════════════════════════════════════════════════

🔐 SEGURIDAD - PRODUCCIÓN:
═════════════════════════════════════════════════════════════════════════════

CAMBIAR CONTRASEÑAS:

1. Edita .env con contraseñas fuertes:
   DB_PASSWORD=tu_contraseña_fuerte_aqui
   PGADMIN_PASSWORD=otro_password_fuerte

2. NO mapees Puerto 5432 a internet
   Configura firewall apropiadamente

3. Usa variables de entorno para secretos

4. Haz backups regularmente:
   0 2 * * * docker-compose exec postgres pg_dump -U postgres tiktok_live_db > /backup/backup_$(date +\%Y\%m\%d).sql

5. Monitorea la actividad de la base de datos

═════════════════════════════════════════════════════════════════════════════

❓ SOLUCIÓN DE PROBLEMAS:
═════════════════════════════════════════════════════════════════════════════

Problema: No se conecta a PostgreSQL
Solución:
   1. Verifica que Docker está corriendo: docker ps
   2. Verifica los logs: docker-compose logs postgres
   3. Reinicia: docker-compose restart postgres

Problema: Puerto 5432 en uso
Solución:
   1. Cambia en .env: DB_PORT=5433
   2. Actualiza docker-compose.yml
   3. Reinicia: docker-compose up -d

Problema: pgAdmin no carga
Solución:
   1. Limpia cache del navegador
   2. Intenta puerto diferente
   3. Reinicia: docker-compose restart pgadmin

Problema: Tabla no existe
Solución:
   1. Verifica que init-db.sql se ejecutó: docker-compose logs postgres | grep init
   2. Si no aparece, reinicia con -v: docker-compose down -v && docker-compose up -d

═════════════════════════════════════════════════════════════════════════════

📚 DOCUMENTACIÓN:
═════════════════════════════════════════════════════════════════════════════

Lee estos archivos para más información:

1. DATABASE_SETUP.md
   └─ Guía detallada de config y uso

2. Dockerfile
   └─ Cómo containerizar la app

3. dockploy.json
   └─ Configuración para deploy remoto

4. Código fuente:
   ├── config/database.js
   └── config/db-helpers.js

═════════════════════════════════════════════════════════════════════════════

✅ PRÓXIMOS PASOS:
═════════════════════════════════════════════════════════════════════════════

1. ✓ Ejecutar start-postgres.bat (o .sh en Linux/Mac)
2. ✓ Verificar conexión con test-database.js
3. ✓ Acceder a pgAdmin en http://localhost:5050
4. ✓ Integrar dbHelpers con tus monitores (monitoreo-tiktok.js, etc.)
5. ✓ Crear endpoints API para consultar datos
6. ✓ Configurar alertas (ej: cuando inicia stream)
7. ✓ Crear dashboards de estadísticas
8. ✓ Deploy a producción con Dockploy

═════════════════════════════════════════════════════════════════════════════

📞 SOPORTE:
═════════════════════════════════════════════════════════════════════════════

Problemas comunes:
   • PostgreSQL: https://www.postgresql.org/docs/
   • Docker: https://docs.docker.com/
   • Node.js/pg: https://node-postgres.com/

═════════════════════════════════════════════════════════════════════════════

🎯 ¡Tu configuración de PostgreSQL + Docker está lista!
   Ejecuta: .\start-postgres.bat (Windows) o bash start-postgres.sh (Linux/Mac)

═════════════════════════════════════════════════════════════════════════════

Creado por: GitHub Copilot
Versión: 1.0
Fecha: 2026-04-10
