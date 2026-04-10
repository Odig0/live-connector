# 📊 Referencia de Endpoints - Live Count API

## 🏗️ Arquitectura

```
/src
├── controllers/
│   └── live-count.controller.js    ← Lógica de requests/responses
├── services/
│   └── live-count.service.js       ← Lógica de negocio
└── routes/
    └── live-count.routes.js        ← Definición de endpoints
```

---

## 🚀 Inicio Rápido

### 1. Iniciar servidor
```bash
npm run server
```

### 2. Verificar conexión
```bash
curl -X GET http://localhost:3000/api/live/health
```

### 3. Crear un registro
```bash
curl -X POST http://localhost:3000/api/live/create \
  -H "Content-Type: application/json" \
  -d '{"channel_name":"El Deber","platform":"tiktok","view_count":2500}'
```

---

## 📋 Tabla de Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/live/create` | Crear 1 registro |
| POST | `/api/live/create-multiple` | Crear múltiples |
| GET | `/api/live/all` | Obtener todos |
| GET | `/api/live/platform/:platform` | Por plataforma |
| GET | `/api/live/channel/:channel` | Por canal |
| GET | `/api/live/date/:date` | Por fecha |
| GET | `/api/live/summary/:platform/:date` | Resumen |
| POST | `/api/live/update/:id` | Actualizar |
| DELETE | `/api/live/delete/:id` | Eliminar |
| GET | `/api/live/health` | Verificar BD |

---

## 📝 Endpoints Detallados

### ✅ POST /api/live/create
Crear un nuevo registro manual

**Request:**
```json
{
  "channel_name": "El Deber",
  "platform": "tiktok",
  "view_count": 2500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registro creado correctamente",
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

**Ejemplo curl:**
```bash
curl -X POST http://localhost:3000/api/live/create \
  -H "Content-Type: application/json" \
  -d '{"channel_name":"El Deber","platform":"tiktok","view_count":2500}'
```

---

### ✅ POST /api/live/create-multiple
Crear múltiples registros de prueba

**Request (opcionales todos los campos):**
```json
{
  "count": 5,
  "platforms": ["tiktok", "facebook", "youtube"],
  "channels": ["El Deber", "Unitel", "Bolivisión"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "5 registros creados correctamente",
  "count": 5,
  "data": [
    { "id": 2, "channel_name": "Unitel", ... },
    { "id": 3, "channel_name": "Bolivisión", ... },
    ...
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

**Ejemplo curl:**
```bash
curl -X POST http://localhost:3000/api/live/create-multiple \
  -H "Content-Type: application/json" \
  -d '{"count":10}'
```

---

### ✅ GET /api/live/all
Obtener todos los registros

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    { "id": 1, "channel_name": "El Deber", ... },
    { "id": 2, "channel_name": "Unitel", ... },
    ...
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

**Ejemplo curl:**
```bash
curl -X GET http://localhost:3000/api/live/all
```

---

### ✅ GET /api/live/platform/:platform
Filtrar por plataforma

**URL:**
```
http://localhost:3000/api/live/platform/tiktok
http://localhost:3000/api/live/platform/facebook
http://localhost:3000/api/live/platform/youtube
```

**Response:**
```json
{
  "success": true,
  "platform": "tiktok",
  "count": 5,
  "data": [ ... ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### ✅ GET /api/live/channel/:channel
Filtrar por canal

**URL:**
```
http://localhost:3000/api/live/channel/El%20Deber
http://localhost:3000/api/live/channel/Unitel
http://localhost:3000/api/live/channel/Bolivisión
```

**Ejemplo curl:**
```bash
curl -X GET "http://localhost:3000/api/live/channel/El%20Deber"
```

---

### ✅ GET /api/live/date/:date
Filtrar por fecha

**URL:**
```
http://localhost:3000/api/live/date/2026-04-10
http://localhost:3000/api/live/date/2026-04-09
```

---

### ✅ GET /api/live/summary/:platform/:date
Obtener resumen estadístico

**URL:**
```
http://localhost:3000/api/live/summary/tiktok/2026-04-10
```

**Response:**
```json
{
  "success": true,
  "platform": "tiktok",
  "date": "2026-04-10",
  "count": 3,
  "data": [
    {
      "channel_name": "El Deber",
      "platform": "tiktok",
      "total_records": 5,
      "avg_views": 3000,
      "max_views": 5000,
      "min_views": 1000,
      "total_views": 15000
    }
  ],
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

### ✅ POST /api/live/update/:id
Actualizar un registro

**URL:**
```
http://localhost:3000/api/live/update/1
```

**Request:**
```json
{
  "view_count": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registro actualizado correctamente",
  "data": {
    "id": 1,
    "view_count": 5000,
    "time_with_seconds": "14:35:20",
    ...
  },
  "timestamp": "2026-04-10T14:35:20.123Z"
}
```

---

### ✅ DELETE /api/live/delete/:id
Eliminar un registro

**URL:**
```
http://localhost:3000/api/live/delete/1
```

**Response:**
```json
{
  "success": true,
  "message": "Registro eliminado correctamente",
  "data": { ... },
  "timestamp": "2026-04-10T14:35:20.123Z"
}
```

---

### ✅ GET /api/live/health
Verificar conexión a la base de datos

**Response (si connección OK):**
```json
{
  "success": true,
  "status": "connected",
  "message": "Conexión a PostgreSQL establecida",
  "database": {
    "host": "18.211.47.248",
    "port": 5432,
    "database": "live_viewers"
  },
  "timestamp": "2026-04-10T14:30:45.123Z"
}
```

---

## 💻 Ejemplos en Node.js

### Usar el servicio directamente

```javascript
const liveCountService = require('./src/services/live-count.service');

// Crear registro
const record = await liveCountService.createLiveRecord({
  channel_name: 'El Deber',
  platform: 'tiktok',
  view_count: 5000,
});

// Obtener todos
const all = await liveCountService.getAllRecords();

// Por plataforma
const tiktok = await liveCountService.getRecordsByPlatform('tiktok');

// Por canal
const eldeber = await liveCountService.getRecordsByChannel('El Deber');

// Actualizar
const updated = await liveCountService.updateRecord(recordId, {
  view_count: 10000,
});

// Eliminar
const deleted = await liveCountService.deleteRecord(recordId);
```

---

## 🧪 Script de Pruebas

### Bash (Linux/Mac)
```bash
bash test-live-api.sh
```

### Batch (Windows)
```bash
test-live-api.bat
```

---

## 📁 Estructura de Carpetas

```
TikTok-Live-Connector/
├── src/
│   ├── controllers/
│   │   ├── views.controller.js          (existente)
│   │   └── live-count.controller.js     (✨ nuevo)
│   ├── services/
│   │   ├── tiktok.service.js            (existente)
│   │   ├── facebook.service.js          (existente)
│   │   ├── youtube.service.js           (existente)
│   │   └── live-count.service.js        (✨ nuevo)
│   └── routes/
│       ├── views.routes.js              (existente)
│       └── live-count.routes.js         (✨ nuevo)
├── config/
│   ├── database.js                      (conexión)
│   └── db-helpers.js                    (helpers):
├── app.js                               (actualizado)
└── server.js
```

---

## ✨ Características

✅ CRUD completo (Create, Read, Update, Delete)
✅ Filtros por plataforma, canal, fecha
✅ Resúmenes estadísticos
✅ Health check de BD
✅ Timestamps automáticos
✅ Error handling estructurado
✅ Arquitectura separada (Controller → Service → DB)

---

## 🔧 Próximas Mejoras

- [ ] Validación de entrada más robusta
- [ ] Paginación en listados
- [ ] Autenticación/Autorización
- [ ] Rate limiting
- [ ] Caché de resultados
- [ ] Logs persistentes
- [ ] Documentación Swagger/OpenAPI

---

**Versión:** 2.0  
**Estado:** ✅ Funcional  
**Última actualización:** Abril 2026
