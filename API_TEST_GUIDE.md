# 🧪 Guía de Pruebas - API PostgreSQL Remote

## 📋 Resumen

Se ha configurado la conexión remota a PostgreSQL y se han creado endpoints para insertar/actualizar/consultar datos.

**BD Remota:** `postgresql://el_deber_it:it_el_deber2027@18.211.47.248:5432/live_viewers`

---

## 🚀 Iniciar la Aplicación

```bash
# Opción 1: Usando npm
npm run server

# Opción 2: Desarrollo con nodemon
npm run server:dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📝 Endpoints Disponibles

### ✅ 1. Verificar Conexión a BD

```bash
# GET - Health Check
curl -X GET http://localhost:3000/api/test/health
```

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "message": "Conexión a PostgreSQL establecida correctamente",
  "database": {
    "host": "18.211.47.248",
    "port": 5432,
    "database": "live_viewers",
    "user": "el_deber_it"
  },
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### ➕ 2. Insertar Un Registro

```bash
# POST - Insertar datos de prueba
curl -X POST http://localhost:3000/api/test/insert-fake-data \
  -H "Content-Type: application/json" \
  -d '{
    "channel_name": "El Deber",
    "platform": "tiktok",
    "view_count": 2500
  }'
```

**Campos opcionales:**
- `channel_name` (default: "El Deber")
- `platform` (default: "tiktok", opciones: tiktok|facebook|youtube)
- `view_count` (default: número aleatorio 1000-6000)

**Response:**
```json
{
  "success": true,
  "message": "Datos insertados correctamente",
  "data": {
    "id": 1,
    "channel_name": "El Deber",
    "platform": "tiktok",
    "view_count": 2500,
    "time_with_seconds": "14:30:45",
    "date_recorded": "2026-04-10",
    "created_at": "2026-04-10T14:30:45.123Z"
  },
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### 🔢 3. Insertar Múltiples Registros

```bash
# POST - Insertar 5 registros aleatorios
curl -X POST http://localhost:3000/api/test/insert-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "count": 5,
    "platforms": ["tiktok", "facebook", "youtube"],
    "channels": ["El Deber", "Unitel", "Bolivisión"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "5 registros insertados correctamente",
  "count": 5,
  "data": [
    { "id": 2, "channel_name": "Unitel", "platform": "facebook", ... },
    { "id": 3, "channel_name": "Bolivisión", "platform": "youtube", ... },
    ...
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### 📖 4. Obtener Todos los Registros

```bash
# GET - Obtener todos los registros ordenados por fecha
curl -X GET http://localhost:3000/api/test/get-all
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "channel_name": "El Deber",
      "platform": "tiktok",
      "view_count": 2500,
      "time_with_seconds": "14:30:45",
      "date_recorded": "2026-04-10",
      "created_at": "2026-04-10T14:30:45.123Z"
    },
    ...
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### 🔍 5. Filtrar por Plataforma

```bash
# GET - Obtener solo registros de TikTok
curl -X GET http://localhost:3000/api/test/by-platform/tiktok

# Opciones: tiktok | facebook | youtube
```

**Response:**
```json
{
  "success": true,
  "platform": "tiktok",
  "count": 5,
  "data": [
    { "id": 1, "channel_name": "El Deber", "platform": "tiktok", ... },
    { "id": 3, "channel_name": "Unitel", "platform": "tiktok", ... }
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### 👥 6. Filtrar por Canal

```bash
# GET - Obtener solo registros de El Deber
curl -X GET "http://localhost:3000/api/test/by-channel/El%20Deber"
```

**Response:**
```json
{
  "success": true,
  "channel": "El Deber",
  "count": 3,
  "data": [
    { "id": 1, "channel_name": "El Deber", "platform": "tiktok", ... },
    { "id": 5, "channel_name": "El Deber", "platform": "facebook", ... }
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### ✏️ 7. Actualizar un Registro

```bash
# POST - Actualizar un registro por ID
curl -X POST http://localhost:3000/api/test/update/1 \
  -H "Content-Type: application/json" \
  -d '{
    "view_count": 5000,
    "channel_name": "El Deber - Actualizado"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registro actualizado correctamente",
  "data": {
    "id": 1,
    "channel_name": "El Deber - Actualizado",
    "platform": "tiktok",
    "view_count": 5000,
    "time_with_seconds": "14:35:20",
    "date_recorded": "2026-04-10",
    "created_at": "2026-04-10T14:30:45.123Z"
  },
  "timestamp": "2026-04-10T14:35:20.123Z"
}
```

---

### 🗑️ 8. Eliminar un Registro

```bash
# DELETE - Eliminar un registro por ID
curl -X DELETE http://localhost:3000/api/test/delete/1
```

**Response:**
```json
{
  "success": true,
  "message": "Registro eliminado correctamente",
  "data": {
    "id": 1,
    "channel_name": "El Deber",
    "platform": "tiktok",
    "view_count": 2500,
    "time_with_seconds": "14:30:45",
    "date_recorded": "2026-04-10"
  },
  "timestamp": "2026-04-10T14:35:20.123Z"
}
```

---

## 🧪 Prueba Completa Automatizada

```bash
# Ejecutar pruebas automáticas (necesita que el servidor esté corriendo)
node test-api-endpoints.js
```

Este script ejecutará todas las pruebas en orden:
1. ✅ Verificar conexión a BD
2. ➕ Insertar un registro
3. 🔢 Insertar múltiples registros
4. 📖 Obtener todos
5. 🔍 Filtrar por plataforma
6. 👥 Filtrar por canal
7. ✏️ Actualizar un registro
8. 🗑️ Eliminar un registro

---

## 🧸 Variables de Entorno (.env)

```env
# Conexión remota actualizada
DATABASE_URL=postgresql://el_deber_it:it_el_deber2027@18.211.47.248:5432/live_viewers

# O usar variables individuales
DB_HOST=18.211.47.248
DB_PORT=5432
DB_USER=el_deber_it
DB_PASSWORD=it_el_deber2027
DB_NAME=live_viewers
```

---

## 💡 Ejemplos desde Node.js

### Insertar datos

```javascript
const dbHelpers = require('./config/db-helpers');

const result = await dbHelpers.createLiveCount({
  channel_name: 'El Deber',
  platform: 'tiktok',
  view_count: 5000,
});

console.log('Registro creado:', result.id);
```

### Obtener datos

```javascript
const records = await dbHelpers.getAllLiveCount();
console.log('Total registros:', records.rows.length);

records.rows.forEach(record => {
  console.log(`${record.channel_name} (${record.platform}): ${record.view_count} vistas`);
});
```

### Filtrar

```javascript
const tiktokRecords = await dbHelpers.getLiveCountByPlatform('tiktok');
const elDeberRecords = await dbHelpers.getLiveCountByChannel('El Deber');
```

### Actualizar

```javascript
const updated = await dbHelpers.updateLiveCount(recordId, {
  view_count: 10000,
});
```

### Eliminar

```javascript
const deleted = await dbHelpers.deleteLiveCount(recordId);
```

---

## 🔧 Herramientas Recomendadas para Probar

### Postman
1. Descarga desde: https://www.postman.com/downloads/
2. Importa los ejemplos anteriores
3. Configura el host: `localhost:3000`

### Insomnia
1. Descarga desde: https://insomnia.rest/
2. Crea requests manualmente
3. Prueba los endpoints

### curl (Terminal)
Usa los ejemplos `curl` mostrados arriba

### Thunder Client (VS Code)
1. Instala la extensión en VS Code
2. Crea requests directamente en el editor

---

## 📊 Tabla de Estructura

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único (auto-increment) |
| channel_name | VARCHAR | Nombre del canal |
| platform | VARCHAR | Plataforma (tiktok/facebook/youtube) |
| view_count | INTEGER | Cantidad de vistas |
| time_with_seconds | TIME | Hora con segundos (HH:MM:SS) |
| date_recorded | DATE | Fecha (YYYY-MM-DD) |
| created_at | TIMESTAMP | Timestamp de creación |

---

## 🚀 Proceso Completo (Paso a Paso)

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Actualizar .env
```env
DATABASE_URL=postgresql://el_deber_it:it_el_deber2027@18.211.47.248:5432/live_viewers
```

### Paso 3: Iniciar servidor
```bash
npm run server
```

### Paso 4: Probar conexión
```bash
curl -X GET http://localhost:3000/api/test/health
```

### Paso 5: Insertar datos
```bash
curl -X POST http://localhost:3000/api/test/insert-fake-data \
  -H "Content-Type: application/json" \
  -d '{"channel_name": "El Deber", "platform": "tiktok", "view_count": 2500}'
```

### Paso 6: Consultar datos
```bash
curl -X GET http://localhost:3000/api/test/get-all
```

---

## ✅ Check List

- [ ] .env actualizado con BD remota
- [ ] npm install ejecutado
- [ ] Servidor iniciado (`npm run server`)
- [ ] Conexión verificada (`GET /api/test/health`)
- [ ] Datos de prueba insertados (`POST /api/test/insert-fake-data`)
- [ ] Datos consultados (`GET /api/test/get-all`)
- [ ] Tablas creadas en la BD remota

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica el `.env` esté correcto
- Verifica que puedas acceder a `18.211.47.248:5432`
- Comprueba firewall del servidor

### Error: "Table does not exist"
- Verifica que `init-db.sql` se ejecutó
- Conecta a la BD remota y corre: `\dt` en psql

### Error: "Port 3000 already in use"
- Cambia PORT en .env: `PORT=3001`
- O mata el proceso: `lsof -ti:3000 | xargs kill -9`

---

## 📚 Documentación Adicional

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Node.js pg library](https://node-postgres.com/)
- [Express.js](https://expressjs.com/)
- [curl documentation](https://curl.se/docs/)

---

**Creado:** Abril 2026
**Versión:** 1.0
**Estado:** ✅ Funcional
