# 🚀 API de Monitoreo de Viewers - Documentación

API unificado para obtener viewers en vivo de TikTok, Facebook y YouTube desde un único endpoint.

## 📋 Quick Start (5 minutos)

### 1️⃣ Verificar compilación
```bash
npm run build
```

### 2️⃣ Configurar tus canales
Edita `server.js` línea 12-30 y reemplaza con tus datos:

```javascript
const CHANNELS_CONFIG = {
  unitel: {
    name: 'Unitel',
    tiktok: 'TU_USUARIO_TIKTOK',
    facebook: 'https://www.facebook.com/watch/?v=VIDEO_ID',
    youtube: 'https://www.youtube.com/watch?v=VIDEO_ID'
  },
  // ... más canales
};
```

**Cómo obtener cada valor:**
- **TikTok**: El username del canal (ej: `zelikafb`)
- **Facebook**: URL completa de un video en vivo
- **YouTube**: URL completa de un video en vivo

### 3️⃣ Ejecutar el servidor
```bash
npm run server
```

Deberías ver:
```
╔════════════════════════════════════════════════════╗
║      Stream Views Monitor API - v1.0.0             ║
║════════════════════════════════════════════════════╝
  🚀 Servidor iniciado
  🌐 URL: http://localhost:3000
  ...
```

### 4️⃣ Probar el endpoint
```bash
curl http://localhost:3000/api/views
```

---

## 🔌 Endpoints

### GET /api/views
Retorna viewers de todos los canales en todas las plataformas.

**Respuesta (200 OK):**
```json
{
  "success": true,
  "timestamp": "2024-04-09T14:30:00.123Z",
  "data": {
    "unitel": {
      "tiktok": 15234,
      "facebook": 8920,
      "youtube": 12450
    },
    "bolivision": {
      "tiktok": 9234,
      "facebook": 5120,
      "youtube": 7890
    },
    "eldeber": {
      "tiktok": 2500,
      "facebook": 1200,
      "youtube": 3400
    }
  }
}
```

**Notas:**
- Las peticiones se ejecutan EN PARALELO (mucho más rápido)
- Si una plataforma falla, retorna `0` automáticamente
- `timestamp` muestra cuándo se obtuvieron los datos

### GET /api/health
Health check del servidor.

**Respuesta (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-04-09T14:30:00.123Z"
}
```

### GET /
Información del API.

**Respuesta:**
```json
{
  "name": "Stream Views Monitor API",
  "version": "1.0.0",
  "endpoints": {
    "GET /api/views": "Obtiene viewers de todos los canales en todas las plataformas",
    "GET /api/health": "Health check del servidor"
  }
}
```

---

## 🛠️ Estructura del código

```
TikTok-Live-Connector/
├── server.js                    ← Punto de entrada (EDITA CHANNELS_CONFIG aquí)
├── app.js                       ← Configuración Express
├── src/
│   ├── services/
│   │   ├── tiktok.service.js    ← Lógica TikTok
│   │   ├── facebook.service.js  ← Lógica Facebook
│   │   └── youtube.service.js   ← Lógica YouTube
│   ├── controllers/
│   │   └── views.controller.js  ← Orquesta servicios
│   └── routes/
│       └── views.routes.js      ← Definición endpoints
├── monitoreo-tiktok.js          ← Archivo original (sin cambios)
├── monitoreo-facebook.js        ← Archivo original (sin cambios)
├── monitoreo-youtube.js         ← Archivo original (sin cambios)
└── package.json
```

---

## 📡 Scripts disponibles

```bash
npm run build         # Compile TypeScript
npm run server        # Inicia el servidor (http://localhost:3000)
npm run server:dev    # Inicia con nodemon (auto-reload en cambios)
npm run api:views     # Alias de npm run server
```

---

## 🔍 Cómo funciona internamente

```
GET /api/views
      ↓
    app.js (Express)
      ↓
  views.routes.js (router)
      ↓
views.controller.js (getAllViewers)
      ↓
    Promise.all() ← EJECUCIÓN PARALELA
      ├── getTikTokViewersMultiple()      → tiktok.service.js
      ├── getFacebookViewersMultiple()    → facebook.service.js
      └── getYouTubeViewersMultiple()     → youtube.service.js
      ↓
  Consolida resultados
      ↓
  Retorna JSON al cliente
```

---

## ⚡ Ventajas del nuevo diseño

✅ **Mejor rendimiento**: Promise.all() ejecuta las 3 plataformas en paralelo  
✅ **Modular**: Fácil agregar más canales o plataformas  
✅ **Robusto**: Fallback automático a 0 si hay errores  
✅ **Reutilizable**: Lógica separada de la presentación  
✅ **Sintético**: Un único endpoint en lugar de 3 scripts  
✅ **Manejo de errores**: Captura todos los casos sin romper el servidor  

---

## 🧪 Ejemplos de uso

### Con Node.js
```javascript
const http = require('http');

http.get('http://localhost:3000/api/views', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
```

### Con cURL
```bash
curl -X GET http://localhost:3000/api/views
```

### Con JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/views')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Con Python
```python
import requests
response = requests.get('http://localhost:3000/api/views')
print(response.json())
```

---

## 🔧 Extensiones futuras

### Agregar un nuevo canal
Edita `server.js`:
```javascript
const CHANNELS_CONFIG = {
  // ... canales existentes
  nuevoCanal: {
    name: 'Nuevo Canal',
    tiktok: 'usuario_tiktok',
    facebook: 'https://facebook.com/...',
    youtube: 'https://youtube.com/...'
  }
};
```
¡Listo! El API automáticamente lo incluirá.

### Agregar una nueva plataforma (ej: Twitch)
1. Crear `src/services/twitch.service.js` con `getTwitchViewersMultiple()`
2. Importar en `src/controllers/views.controller.js`
3. Agregar al `Promise.all()`
4. Agregar URLs Twitch en `CHANNELS_CONFIG`

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Port 3000 already in use" | Cambiar `.env`: `PORT=3001` |
| "Cannot find module ./dist" | Ejecutar: `npm run build` |
| "Puppeteer timeout" | Aumenta timeout en `facebook.service.js` línea 10 |
| "TikTok timeout" | Verifica que el canal esté en vivo |
| Error 404 en /api/views | Verifica que el servidor esté corriendo |

---

## 📚 Archivos relacionados

- [README.md](./README.md) - Documentación de la librería TikTok
- [README-MONITOREO.md](./README-MONITOREO.md) - Documentación original de scripts
- [server.js](./server.js) - Punto de entrada (edita CHANNELS_CONFIG aquí)

---

## 📝 Licencia

MIT
