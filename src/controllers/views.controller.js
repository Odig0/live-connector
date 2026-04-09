/**
 * Controlador para el endpoint de viewers
 * Orquesta los servicios de TikTok, Facebook y YouTube
 */

const { getTikTokViewersMultiple } = require('../services/tiktok.service.js');
const { getFacebookViewersMultiple } = require('../services/facebook.service.js');
const { getYouTubeViewers } = require('../services/youtube.service.js');

/**
 * Handler para POST /api/views - Acepta UN SOLO CANAL por request
 * Body esperado: { youtube: "url", tiktok: "usuario", facebook: "url" }
 * Cada petición es para UN CANAL INDIVIDUAL
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function getViewsPost(req, res) {
  try {
    const { youtube, tiktok, facebook } = req.body;
    
    // Validar que al menos haya un campo
    if (!youtube && !tiktok && !facebook) {
      return res.status(400).json({
        success: false,
        error: 'Body vacío',
        expected: {
          "youtube": "https://www.youtube.com/watch?v=...",
          "tiktok": "usuario",
          "facebook": "https://www.facebook.com/..."
        }
      });
    }
    
    console.log(`\n📨 ${new Date().toISOString()} - POST /api/views (INDIVIDUAL)`);
    console.log(`📡 Plataformas recibidas: ${[youtube && 'YouTube', tiktok && 'TikTok', facebook && 'Facebook'].filter(Boolean).join(', ')}`);
    
    const startTime = Date.now();
    const results = {
      youtube: 0,
      tiktok: 0,
      facebook: 0
    };
    
    // Obtener viewers de cada plataforma de forma SECUENCIAL (no paralelo)
    // Esto evita saturar los recursos
    
    if (tiktok) {
      console.log(`🔄 Obteniendo TikTok @${tiktok}...`);
      try {
        const tiktokData = await getTikTokViewersMultiple({ temp: tiktok });
        results.tiktok = tiktokData.temp || 0;
      } catch (err) {
        console.error(`❌ Error TikTok:`, err.message);
      }
    }
    
    if (facebook) {
      console.log(`🔄 Obteniendo Facebook...`);
      try {
        const facebookData = await getFacebookViewersMultiple({ temp: facebook });
        results.facebook = facebookData.temp || 0;
      } catch (err) {
        console.error(`❌ Error Facebook:`, err.message);
      }
    }
    
    if (youtube) {
      console.log(`🔄 Obteniendo YouTube...`);
      try {
        results.youtube = await getYouTubeViewers(youtube);
      } catch (err) {
        console.error(`❌ Error YouTube:`, err.message);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Completado en ${duration}ms\n`);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      data: results
    });
    
  } catch (error) {
    console.error('❌ Error en getViewsPost:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getViewsPost
};
