/**
 * Servicio para obtener viewers de Facebook Live
 * Reutiliza la lógica de monitoreo-facebook.js con Puppeteer
 */

const puppeteer = require('puppeteer');

/**
 * Convierte strings como "1.2K" a números
 */
function parseViewerCount(viewerString) {
  if (!viewerString || viewerString === 'No disponible') {
    return 0;
  }
  
  viewerString = String(viewerString).toUpperCase().trim();
  
  if (viewerString.includes('K')) {
    return Math.round(parseFloat(viewerString) * 1000);
  }
  if (viewerString.includes('M')) {
    return Math.round(parseFloat(viewerString) * 1000000);
  }
  if (viewerString.includes('B')) {
    return Math.round(parseFloat(viewerString) * 1000000000);
  }
  
  return Math.round(parseFloat(viewerString)) || 0;
}

/**
 * Extrae el número de viewers de Facebook Live usando Puppeteer
 * @param {string} url - URL del video de Facebook
 * @returns {Promise<number>} Número de viewers
 */
async function getFacebookViewers(url) {
  let browser;
  let page;
  
  try {
    console.log(`👍 MONITOREO FACEBOOK LIVE (CON PUPPETEER)\n`);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-resources',
        '--disable-background-networking'
      ]
    });

    page = await browser.newPage();
    
    // Establecer user agent realista
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Viewport realista
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Descartar logs
    page.on('error', err => console.error('Error en página:', err));
    page.on('pageerror', err => console.error('Error JS:', err));

    console.log(`🌐 Cargando Facebook...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log(`✅ Página cargada!\n`);

    // Esperar a que carguen los elementos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Intentar cerrar modal de login si aparece
    try {
      const closeButton = await page.$('[aria-label="Cerrar"], [aria-label="Close"], button[aria-label*="close"]');
      if (closeButton) {
        console.log('🚫 Cerrando modal de login...');
        await closeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (e) {
      // Es normal si no hay modal
    }
    
    // Extracción mejorada: detecta videos en vivo Y grabados
    const viewers = await page.evaluate(() => {
      const allText = document.body.innerText;
      
      // MÉTODO 1: Videos EN VIVO - buscar "watching" o "viendo"
      const liveMatch = allText.match(/(\d+[,.KMB]*)\s+(people\s+)?watching|(\d+[,.KMB]*)\s+viendo/i);
      if (liveMatch) {
        return { type: 'live', value: liveMatch[1] || liveMatch[3] };
      }
      
      // MÉTODO 2: Videos GRABADOS - buscar badge "VIVO" o número de espectadores general
      const elements = document.querySelectorAll('span, div');
      for (let el of elements) {
        const text = el.textContent.trim();
        
        // Buscar números grandes que representen viewers/reacciones
        if (/^\d+[,.]*\s*[KM]?$/i.test(text)) {
          const num = parseInt(text.replace(/[,.KM]/g, ''));
          if (num > 10 && num < 999999999) { // Número razonable de viewers
            if (!text.includes('20') && !text.includes('19')) {
              return { type: 'metric', value: text };
            }
          }
        }
        
        // Buscar texto "VIVO" directamente
        if (text === 'VIVO' || text === 'EN VIVO') {
          continue; // Seguir buscando el número
        }
      }
      
      return { type: 'unknown', value: 'No disponible' };
    });
    
    let displayValue = viewers.value;
    let statusIcon = '❌';
    
    if (viewers.type === 'live') {
      statusIcon = '🔴 EN VIVO';
    } else if (viewers.type === 'metric') {
      statusIcon = '📊 ESTADÍSTICAS';
    } else if (viewers.type === 'unknown') {
      displayValue = 0;
    }
    
    const viewerCount = parseViewerCount(displayValue);
    console.log(`${statusIcon}: ${displayValue}\n`);
    
    if (page) await page.close();
    if (browser) await browser.close();
    
    return viewerCount;
    
  } catch (error) {
    console.error(`❌ Error Facebook:`, error.message);
    
    if (page) {
      try { await page.close(); } catch (e) { }
    }
    if (browser) {
      try { await browser.close(); } catch (e) { }
    }
    
    return 0;
  }
}

/**
 * Obtiene viewers de múltiples URLs de Facebook EN PARALELO
 * @param {object} channels - Objeto { nombreCanal: "https://facebook.com/...", ... }
 * @returns {Promise<object>} { nombreCanal: viewers, ... }
 */
async function getFacebookViewersMultiple(channels) {
  try {
    const results = {};
    
    // Ejecutar todos los scrapes en paralelo
    const promises = Object.entries(channels).map(async ([channelName, url]) => {
      try {
        console.log(`🔄 Obteniendo Facebook para ${channelName}...`);
        const viewers = await getFacebookViewers(url);
        results[channelName] = viewers;
      } catch (error) {
        console.error(`❌ Error Facebook ${channelName}:`, error.message);
        results[channelName] = 0;
      }
    });
    
    await Promise.all(promises);
    return results;
    
  } catch (error) {
    console.error('❌ Error en getFacebookViewersMultiple:', error.message);
    throw error;
  }
}

module.exports = {
  getFacebookViewers,
  getFacebookViewersMultiple
};
