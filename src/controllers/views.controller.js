/**
 * Controlador para el endpoint de viewers
 * Orquesta los servicios de TikTok, Facebook y YouTube
 */

const fs = require('fs');
const path = require('path');
const { getTikTokViewersMultiple } = require('../services/tiktok.service.js');
const { getFacebookViewersMultiple } = require('../services/facebook.service.js');
const { getYouTubeViewers } = require('../services/youtube.service.js');

// Ruta del archivo JSON para almacenar los views
const VIEWS_JSON_PATH = path.join(__dirname, '../../views-cache.json');

/**
 * Leer archivo JSON de views
 */
function readViewsCache() {
  try {
    if (fs.existsSync(VIEWS_JSON_PATH)) {
      const data = fs.readFileSync(VIEWS_JSON_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error leyendo views-cache.json:', error.message);
  }
  return { channels: [] };
}

/**
 * Escribir archivo JSON de views
 */
function writeViewsCache(data) {
  try {
    fs.writeFileSync(VIEWS_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error escribiendo views-cache.json:', error.message);
  }
}

/**
 * Obtener un canal del cache JSON
 */
function getChannelFromCache(name) {
  const cache = readViewsCache();
  return cache.channels.find(c => c.name === name);
}

/**
 * Actualizar o crear canal en cache JSON
 */
function updateChannelInCache(name, platform, views) {
  const cache = readViewsCache();
  let channel = cache.channels.find(c => c.name === name);
  
  if (!channel) {
    channel = { name, youtube: null, tiktok: null, facebook: null };
    cache.channels.push(channel);
  }
  
  if (platform === 'youtube') {
    channel.youtube = { views, updated_at: new Date().toISOString() };
  } else if (platform === 'tiktok') {
    channel.tiktok = { views, updated_at: new Date().toISOString() };
  } else if (platform === 'facebook') {
    channel.facebook = { views, updated_at: new Date().toISOString() };
  }
  
  writeViewsCache(cache);
}

/**
 * Handler para POST /api/views - Obtiene viewers y guarda en JSON
 * Body esperado: { name: "El Deber", youtube: "url" } o cualquier combinación
 * Guarda en archivo JSON en lugar de BD (más eficiente para lectura)
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function getViewsPost(req, res) {
  try {
    const { name, youtube, tiktok, facebook } = req.body;
    
    // Validar que al menos haya un nombre y un campo de plataforma
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Falta el parámetro "name" (nombre del canal)',
        expected: {
          "name": "El Deber",
          "youtube": "https://www.youtube.com/watch?v=...",
          "tiktok": "usuario",
          "facebook": "https://www.facebook.com/..."
        }
      });
    }
    
    if (!youtube && !tiktok && !facebook) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar al menos una plataforma',
        expected: {
          "name": "El Deber",
          "youtube": "https://www.youtube.com/watch?v=...",
          "tiktok": "usuario",
          "facebook": "https://www.facebook.com/..."
        }
      });
    }
    
    console.log(`\n📨 ${new Date().toISOString()} - POST /api/views`);
    console.log(`📺 Canal: ${name}`);
    console.log(`📡 Plataformas: ${[youtube && 'YouTube', tiktok && 'TikTok', facebook && 'Facebook'].filter(Boolean).join(', ')}`);
    
    const startTime = Date.now();
    const results = {}; // Inicializar vacío, solo agregar lo que se pida
    
    // Obtener viewers de cada plataforma de forma SECUENCIAL (no paralelo)
    // Esto evita saturar los recursos
    
    if (tiktok) {
      console.log(`🔄 Obteniendo TikTok @${tiktok}...`);
      try {
        const tiktokData = await getTikTokViewersMultiple({ temp: tiktok });
        results.tiktok = tiktokData.temp || 0;
      } catch (err) {
        console.error(`❌ Error TikTok:`, err.message);
        results.tiktok = 0;
      }
    }
    
    if (facebook) {
      console.log(`🔄 Obteniendo Facebook...`);
      try {
        const facebookData = await getFacebookViewersMultiple({ temp: facebook });
        results.facebook = facebookData.temp || 0;
      } catch (err) {
        console.error(`❌ Error Facebook:`, err.message);
        results.facebook = 0;
      }
    }
    
    if (youtube) {
      console.log(`🔄 Obteniendo YouTube...`);
      try {
        results.youtube = await getYouTubeViewers(youtube);
      } catch (err) {
        console.error(`❌ Error YouTube:`, err.message);
        results.youtube = 0;
      }
    }
    
    // Guardar resultados en JSON (solo si views > 0)
    console.log(`💾 Evaluando resultados...`);
    
    // Contar cuántas plataformas retornaron > 0
    const successCount = Object.values(results).filter(v => v > 0).length;
    const allZero = Object.values(results).every(v => v === 0);
    
    if (allZero) {
      console.error(` Eroor o Canal OFFLINE`);
      const duration = Date.now() - startTime;
      return res.status(503).json({
        success: false,
        error: 'No se pudieron obtener viewers. El canal puede estar offline o hubo un error en los servidores.',
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        data: results
      });
    }
    
    try {
      // Guardar YouTube solo si views > 0
      if (results.youtube !== undefined && results.youtube > 0) {
        updateChannelInCache(name, 'youtube', results.youtube);
        console.log(`✅ YouTube guardado (JSON): ${results.youtube} vistas`);
      } else if (results.youtube === 0) {
        console.log(`⚠️  YouTube retornó 0 vistas - No se guarda`);
      }
      
      // Guardar TikTok solo si views > 0
      if (results.tiktok !== undefined && results.tiktok > 0) {
        updateChannelInCache(name, 'tiktok', results.tiktok);
        console.log(`✅ TikTok guardado (JSON): ${results.tiktok} vistas`);
      } else if (results.tiktok === 0) {
        console.log(`⚠️  TikTok retornó 0 vistas - No se guarda`);
      }
      
      // Guardar Facebook solo si views > 0
      if (results.facebook !== undefined && results.facebook > 0) {
        updateChannelInCache(name, 'facebook', results.facebook);
        console.log(`✅ Facebook guardado (JSON): ${results.facebook} vistas`);
      } else if (results.facebook === 0) {
        console.log(`⚠️  Facebook retornó 0 vistas - No se guarda`);
      }
    } catch (jsonErr) {
      console.error(`❌ Error al guardar en JSON:`, jsonErr.message);
    }
    
    // Limpiar resultados: remover valores de 0
    const cleanResults = {};
    Object.entries(results).forEach(([key, value]) => {
      if (value > 0) {
        cleanResults[key] = value;
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Completado en ${duration}ms\n`);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      data: cleanResults,
      saved: true,
      storage: 'JSON'
    });
    
  } catch (error) {
/**
 * Handler para GET /api/views - Obtiene viewers del JSON
 * Query params esperados: ?name=El Deber&platform=youtube
 * Devuelve los datos guardados del cache JSON
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function getViewsGet(req, res) {
  try {
    const { name, platform } = req.query;
    
    // Validar parámetros
    if (!name || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los parámetros: name y platform',
        example: {
          url: 'GET /api/views?name=El Deber&platform=youtube'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Validar platform
    const validPlatforms = ['youtube', 'tiktok', 'facebook'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Platform inválido. Debe ser: ${validPlatforms.join(', ')}`,
        received: platform,
        timestamp: new Date().toISOString()
      });
    }
    
    // Leer cache JSON
    const cache = readViewsCache();
    const platformLower = platform.toLowerCase();
    
    // Buscar canal
    const channel = cache.channels.find(c => c.name === name);
    
    if (!channel) {
      return res.status(404).json({
        success: false,
        error: `Canal "${name}" no encontrado en cache`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Buscar plataforma en el canal
    const platformData = channel[platformLower];
    
    if (!platformData) {
      return res.status(404).json({
        success: false,
        error: `No hay datos para ${platformLower} en el canal "${name}"`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`✅ GET /api/views - ${name} (${platformLower}): ${platformData.views} vistas`);
    
    res.json({
      success: true,
      channel: name,
      platform: platformLower,
      data: {
        views: platformData.views,
        updated_at: platformData.updated_at
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en getViewsGet:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getViewsPost,
  getViewsGet
};
