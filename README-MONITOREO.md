# 📊 MONITOREO DE LIVES - TIKTOK, YOUTUBE Y FACEBOOK

## ✅ FUNCIONA PERFECTAMENTE

### TikTok (100% Funcional)
```bash
node monitoreo-3.js
```
Monitorea 3 canales de TikTok simultáneamente mostrando espectadores en vivo.

**Edita la línea 3** para cambiar usuarios:
```javascript
const canales = ['zelikafb', 'rqpbolivia', 'wunder_ff'];
```

---

## 📺 YOUTUBE (50% Configurado)

### Pasos:
1. Obtén el VIDEO_ID de un stream en vivo:
   - URL: `https://www.youtube.com/watch?v=AQUI_VA_VIDEO_ID`
   - Ejemplo: `dQw4w9WgXcQ`

2. Edita `youtube-monitor.js` línea 12:
   ```javascript
   const VIDEO_ID = 'dQw4w9WgXcQ'; // Tu video ID
   ```

3. Ejecuta:
   ```bash
   node youtube-monitor.js
   ```

---

## 📘 FACEBOOK (Información Disponible)

Facebook es más complejo por seguridad. Ver `facebook-monitor.js` para opciones:

1. **Puppeteer** (scraping automático)
2. **API Oficial** (requiere token)
3. **fb-chat** (para chat en vivo)

---

## 🚀 VISTA GENERAL (Todas las plataformas)

Para una vista de conjunto (en desarrollo):
```bash
node monitoreo-multiplataforma.js
```

---

## 📦 Librerías Instaladas

- ✅ `tiktok-live-connector` - TikTok
- ✅ `youtube-live-chat` - YouTube
- ⏳ Facebook - Requiere configuración adicional

---

## 💡 Próximos Pasos

1. **Si usas YouTube**: Proporciona el VIDEO_ID
2. **Si usas Facebook**: Proporciona credenciales o URL del live
3. **Para ambos**: Personaliza los usuarios según necesites

---

## 🆘 Soporte

- **TikTok no conecta**: Reinicia el script
- **YouTube "video no existe"**: Verifica que esté en transmisión
- **Facebook**: Requiere configuración manual de credenciales
