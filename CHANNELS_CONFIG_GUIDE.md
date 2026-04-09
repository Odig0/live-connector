/**
 * GUÍA: Cómo configurar tus canales en el API
 * 
 * Edita este archivo en server.js línea 12-30
 */

// ============================================================================
// OPCIÓN 1: Configuración básica (3 canales)
// ============================================================================
const CHANNELS_CONFIG = {
  unitel: {
    name: 'Unitel',
    tiktok: 'zelikafb',
    facebook: 'https://www.facebook.com/watch/?v=1234567890',
    youtube: 'https://www.youtube.com/watch?v=ABC123DEF45'
  },
  bolivision: {
    name: 'Bolivisión',
    tiktok: 'rqpbolivia',
    facebook: 'https://www.facebook.com/watch/?v=2345678901',
    youtube: 'https://www.youtube.com/watch?v=BCD234EF567'
  },
  eldeber: {
    name: 'El Deber',
    tiktok: 'wunder_ff',
    facebook: 'https://www.facebook.com/watch/?v=3456789012',
    youtube: 'https://www.youtube.com/watch?v=CDE345FG678'
  }
};

// ============================================================================
// OPCIÓN 2: Agregar más canales (4 o más)
// ============================================================================
const CHANNELS_CONFIG_EXTENDED = {
  unitel: {
    name: 'Unitel',
    tiktok: 'zelikafb',
    facebook: 'https://www.facebook.com/watch/?v=1234567890',
    youtube: 'https://www.youtube.com/watch?v=ABC123DEF45'
  },
  bolivision: {
    name: 'Bolivisión',
    tiktok: 'rqpbolivia',
    facebook: 'https://www.facebook.com/watch/?v=2345678901',
    youtube: 'https://www.youtube.com/watch?v=BCD234EF567'
  },
  eldeber: {
    name: 'El Deber',
    tiktok: 'wunder_ff',
    facebook: 'https://www.facebook.com/watch/?v=3456789012',
    youtube: 'https://www.youtube.com/watch?v=CDE345FG678'
  },
  pttv: {
    name: 'PTTV',
    tiktok: 'usuario_pttv',
    facebook: 'https://www.facebook.com/watch/?v=4567890123',
    youtube: 'https://www.youtube.com/watch?v=DEF456GH789'
  },
  atb: {
    name: 'ATB',
    tiktok: 'usuario_atb',
    facebook: 'https://www.facebook.com/watch/?v=5678901234',
    youtube: 'https://www.youtube.com/watch?v=EFG567HI890'
  }
};

// ============================================================================
// OPCIÓN 3: Solo algunas plataformas (no todas necesitan llenar los 3)
// ============================================================================
const CHANNELS_CONFIG_PARTIAL = {
  unitel: {
    name: 'Unitel',
    tiktok: 'zelikafb',
    facebook: 'https://www.facebook.com/watch/?v=1234567890'
    // youtube no relleno, retornará 0
  },
  eldeber: {
    name: 'El Deber',
    // tiktok no relleno, retornará 0
    facebook: 'https://www.facebook.com/watch/?v=3456789012',
    youtube: 'https://www.youtube.com/watch?v=CDE345FG678'
  }
};

// ============================================================================
// CÓMO ENCONTRAR CADA VALOR
// ============================================================================

/**
 * TIKTOK USERNAME
 * - Ir a: https://www.tiktok.com/@username
 * - El username es lo que va después de @
 * - Ejemplo: https://www.tiktok.com/@zelikafb → username es "zelikafb"
 * - Sin el @ símbolo
 */

/**
 * FACEBOOK VIDEO URL
 * - Entrar al video en vivo en Facebook
 * - El URL estará en la barra de direcciones
 * - Copiar la URL completa: https://www.facebook.com/watch/?v=123456789
 * 
 * Ejemplo real:
 *   URL: https://www.facebook.com/watch/?v=2360655077780439
 *   Copiar exactamente
 */

/**
 * YOUTUBE VIDEO URL
 * - Entrar al video en vivo en YouTube
 * - El URL estará en la barra de direcciones
 * - Copiar la URL completa: https://www.youtube.com/watch?v=VIDEO_ID
 * 
 * Ejemplo real:
 *   URL: https://www.youtube.com/watch?v=oxT5R6I0N6E
 *   Copiar exactamente
 */

// ============================================================================
// RESPUESTA DEL API CON ESTAS CONFIGURACIONES
// ============================================================================

/**
 * Con CHANNELS_CONFIG, GET /api/views retorna:
 * 
 * {
 *   "success": true,
 *   "timestamp": "2024-04-09T14:30:00.123Z",
 *   "data": {
 *     "unitel": {
 *       "tiktok": 15234,
 *       "facebook": 8920,
 *       "youtube": 12450
 *     },
 *     "bolivision": {
 *       "tiktok": 9234,
 *       "facebook": 5120,
 *       "youtube": 7890
 *     },
 *     "eldeber": {
 *       "tiktok": 2500,
 *       "facebook": 1200,
 *       "youtube": 3400
 *     }
 *   }
 * }
 */

/**
 * Con CHANNELS_CONFIG_PARTIAL (sin youtube en unitel, sin tiktok en eldeber):
 * 
 * {
 *   "success": true,
 *   "timestamp": "2024-04-09T14:30:00.123Z",
 *   "data": {
 *     "unitel": {
 *       "tiktok": 15234,
 *       "facebook": 8920,
 *       "youtube": 0        ← No configurado
 *     },
 *     "eldeber": {
 *       "tiktok": 0,        ← No configurado
 *       "facebook": 1200,
 *       "youtube": 3400
 *     }
 *   }
 * }
 */

// ============================================================================
// PASOS PARA CONFIGURAR
// ============================================================================

/**
 * 1. Abre server.js
 * 
 * 2. Encuentra la sección "CONFIGURACIÓN DE CANALES" (línea 12)
 * 
 * 3. Reemplaza CHANNELS_CONFIG con tus valores reales
 * 
 * 4. Ejemplo si solo tienes TikTok:
 *    ```javascript
 *    const CHANNELS_CONFIG = {
 *      unitel: {
 *        name: 'Unitel',
 *        tiktok: 'zelikafb'
 *      },
 *      bolivision: {
 *        name: 'Bolivisión',
 *        tiktok: 'rqpbolivia'
 *      }
 *    };
 *    ```
 *    Los valores no definidos retornarán 0
 * 
 * 5. Guarda server.js
 * 
 * 6. Reinicia el servidor: npm run server
 * 
 * 7. Prueba: curl http://localhost:3000/api/views
 */

// ============================================================================
// ERRORES COMUNES
// ============================================================================

/**
 * ❌ Error: "Cannot find module"
 *    Solución: Ejecuta npm run build primero
 * 
 * ❌ Error: "Timeout TikTok @zelikafb"
 *    Solución: Verifica que el canal esté online
 * 
 * ❌ Error: "Connection refused at localhost:3000"
 *    Solución: El servidor no está corriendo, ejecuta npm run server
 * 
 * ❌ Retorna 0 en todas las plataformas
 *    Solución: Verifica que los URLs/usernames están correctos
 * 
 * ❌ "Port 3000 already in use"
 *    Solución: Cambia PORT en .env (ej: PORT=3001)
 */

module.exports = {
  CHANNELS_CONFIG,
  CHANNELS_CONFIG_EXTENDED,
  CHANNELS_CONFIG_PARTIAL
};
