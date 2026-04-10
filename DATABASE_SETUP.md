# 📊 Guía de Configuración - PostgreSQL + Docker + Dockploy

## 📋 Descripción General

Esta configuración proporciona una solución completa para almacenar datos de transmisiones en vivo de múltiples plataformas (TikTok, Facebook, YouTube) usando PostgreSQL en Docker.

## 📦 Contenido de la Configuración

### Archivos Principales

1. **`docker-compose.yml`** - Configuración de Docker para PostgreSQL y pgAdmin
2. **`init-db.sql`** - Script SQL para crear tablas e índices
3. **`.env`** - Variables de entorno
4. **`config/database.js`** - Módulo de conexión a PostgreSQL
5. **`config/db-helpers.js`** - Funciones auxiliares para operaciones con la BD
6. **`test-database.js`** - Script para probar la conexión

## 🚀 Pasos para Configurar

### 1. Actualizar Dependencias

```bash
npm install
```

Esto instalará la librería `pg` necesaria para conectarse a PostgreSQL.

### 2. Iniciar PostgreSQL con Docker

```bash
# Iniciar el contenedor
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps

# Ver los logs
docker-compose logs postgres
```

**Nota:** El archivo `init-db.sql` se ejecutará automáticamente la primera vez que se inicie PostgreSQL, creando todas las tablas.

### 3. Verificar la Conexión

```bash
node test-database.js
```

Este script:
- ✅ Verifica la conexión
- ✅ Crea un registro de prueba
- ✅ Registra eventos
- ✅ Recupera datos
- ✅ Finaliza la transmisión

### 4. Acceder a pgAdmin (Interfaz Web)

- **URL:** http://localhost:5050
- **Email:** admin@admin.com (por defecto)
- **Contraseña:** admin (por defecto)

Una vez dentro:
1. Haz clic en "Add New Server"
2. Nombre: `TikTok Live DB`
3. En la pestaña "Connection":
   - Host: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres123`

## 📊 Estructura de Tablas

### Tabla: `live_count`

Almacena información sobre transmisiones en vivo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| channel_name | VARCHAR | Nombre del canal |
| platform | VARCHAR | Plataforma (tiktok, facebook, youtube) |
| view_count | INTEGER | Número de vistas |
| like_count | INTEGER | Número de likes/reacciones |
| comment_count | INTEGER | Número de comentarios |
| share_count | INTEGER | Número de compartidas |
| gift_count | INTEGER | Número de regalos |
| concurrent_viewers | INTEGER | Espectadores concurrentes |
| stream_info | JSONB | Info adicional en formato JSON |
| is_live | BOOLEAN | Si está en vivo actualmente |
| started_at | TIMESTAMP | Cuándo comenzó |
| updated_at | TIMESTAMP | Última actualización (automática) |
| ended_at | TIMESTAMP | Cuándo terminó |

### Tabla: `live_events`

Registra eventos individuales (comentarios, regalos, etc.)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| live_count_id | INTEGER | Referencia a live_count |
| event_type | VARCHAR | Tipo (comment, like, gift, etc.) |
| user_nickname | VARCHAR | Nickname del usuario |
| user_id | VARCHAR | ID del usuario |
| content | TEXT | Contenido del comentario |
| gift_name | VARCHAR | Nombre del regalo |
| gift_count | INTEGER | Cantidad de regalos |
| gift_price | DECIMAL | Precio del regalo |
| created_at | TIMESTAMP | Cuándo ocurrió |

### Tabla: `channel_config`

Configuración de canales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| channel_name | VARCHAR | Nombre único del canal |
| tiktok_handle | VARCHAR | Usuario de TikTok |
| facebook_url | TEXT | URL de Facebook |
| youtube_url | TEXT | URL de YouTube |
| is_active | BOOLEAN | Si está activo |

## 💻 Uso en tu Aplicación

### Ejemplo 1: Crear una nueva transmisión

```javascript
const dbHelpers = require('./config/db-helpers');

const newLive = await dbHelpers.createLiveCount({
  channel_name: 'El Deber',
  platform: 'tiktok',
  view_count: 1000,
  is_live: true,
});

console.log('Nuevas transmisión ID:', newLive.id);
```

### Ejemplo 2: Registrar un evento (comentario o regalo)

```javascript
await dbHelpers.recordEvent(liveCountId, {
  event_type: 'comment',
  user_nickname: 'Juan',
  user_id: '12345',
  content: 'Gran transmisión!',
});

await dbHelpers.recordEvent(liveCountId, {
  event_type: 'gift',
  user_nickname: 'Maria',
  user_id: '67890',
  gift_name: 'Rose',
  gift_count: 5,
  gift_price: 10.50,
});
```

### Ejemplo 3: Actualizar conteo de vistas

```javascript
await dbHelpers.updateLiveCount(liveCountId, {
  view_count: 5000,
  concurrent_viewers: 1200,
  comment_count: 300,
});
```

### Ejemplo 4: Obtener transmisiones activas

```javascript
const result = await dbHelpers.getActiveLives();
console.log(result.rows);
```

### Ejemplo 5: Finalizar una transmisión

```javascript
await dbHelpers.endLiveStream(liveCountId);
```

### Ejemplo 6: Obtener estadísticas

```javascript
const stats = await dbHelpers.getLiveSummary('El Deber', 'tiktok');
console.log(stats);
```

## 🛠️ Variables de Entorno (.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=tiktok_live_db

# Alternativa: Usar DATABASE_URL
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tiktok_live_db

# pgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

## 🔧 Comandos Útiles de Docker

```bash
# Ver contenedores
docker-compose ps

# Ver logs
docker-compose logs postgres
docker-compose logs pgadmin

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡BORRA LOS DATOS!)
docker-compose down -v

# Acceder a PostgreSQL desde terminal
docker-compose exec postgres psql -U postgres -d tiktok_live_db

# Hacer backup
docker-compose exec postgres pg_dump -U postgres tiktok_live_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres tiktok_live_db < backup.sql
```

## 📝 Comandos SQL Útiles

```sql
-- Ver todas las transmisiones activas
SELECT * FROM live_count WHERE is_live = true;

-- Ver estadísticas actuales
SELECT * FROM current_live_stats;

-- Contar eventos por tipo
SELECT event_type, COUNT(*) FROM live_events GROUP BY event_type;

-- Total de regalos recibidos
SELECT SUM(gift_price) as total_gifts_value FROM live_events WHERE event_type = 'gift';

-- Top de usuarios por regalos
SELECT user_nickname, COUNT(*) as gift_count 
FROM live_events 
WHERE event_type = 'gift' 
GROUP BY user_nickname 
ORDER BY gift_count DESC;
```

## 🔐 Consideraciones de Seguridad

Para producción:

1. **Cambiar contraseñas por defecto** en `.env`
2. **No exponer PostgreSQL** al internet (no mapear puerto 5432)
3. **Usar variables de entorno** para credenciales sensibles
4. **Crear usuarios específicos** con permisos limitados
5. **Realizar backups regularmente**
6. **Usar SSL/TLS** si accedes remotamente

Ejemplo de usuario con permisos limitados:

```sql
CREATE USER app_user WITH PASSWORD 'strong_secure_password';
GRANT CONNECT ON DATABASE tiktok_live_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
```

## 📞 Solución de Problemas

### No se conecta a PostgreSQL

```bash
# Verificar que el contenedor está corriendo
docker-compose ps

# Ver los logs de error
docker-compose logs postgres

# Reiniciar el contenedor
docker-compose restart postgres
```

### Puerto ya en uso

```bash
# Cambiar el puerto en docker-compose.yml o .env
DB_PORT=5433
```

### Borrar todo y empezar de cero

```bash
docker-compose down -v
docker-compose up -d
node test-database.js
```

## 🎯 Próximos Pasos

1. ✅ Integrar con los monitores existentes (monitoreo-tiktok.js, etc.)
2. ✅ Crear endpoints API para consultar datos
3. ✅ Agregar autenticación a los endpoints
4. ✅ Crear reportes y dashboards
5. ✅ Configurar alertas (p.ej., cuando un canal inicia transmisión)

## 📚 Referencias

- [Documentación de pg (Node.js)](https://node-postgres.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Dockploy Docs](https://dockploy.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

**Creado para TikTok Live Connector** 🎬📊
