/**
 * Servicio para obtener viewers de YouTube Live
 * Reutiliza la lógica de monitoreo-youtube.js con Puppeteer
 * Implementa pool de browsers para mejor rendimiento y estabilidad
 */

const puppeteer = require('puppeteer');

/**
 * Clase YouTubeService - Gestiona las conexiones a YouTube
 */
class YouTubeService {
  constructor() {
    this.browser = null;
    this.isConnecting = false;
  }

  /**
   * Convierte strings como "1.2K" o "8,278" a números
   */
  parseViewerCount(viewerString) {
    if (!viewerString || viewerString === 'No disponible' || viewerString === '') {
      return 0;
    }
    
    viewerString = String(viewerString).trim();
    
    // Remover espacios en blanco
    viewerString = viewerString.replace(/\s+/g, '');
    
    // Convertir a uppercase para detectar K, M, B
    const upperVersion = viewerString.toUpperCase();
    
    // Remover todo excepto números, comas, puntos y letras K, M, B
    let cleanNumber = viewerString.replace(/[^\d,.KMGB]/gi, '');
    
    // Si tiene K, M, B (abbreviaciones)
    if (cleanNumber.includes('K') || cleanNumber.includes('M') || cleanNumber.includes('B')) {
      cleanNumber = cleanNumber.toUpperCase();
      
      if (cleanNumber.includes('K')) {
        const num = parseFloat(cleanNumber.replace('K', ''));
        return Math.round(num * 1000);
      }
      if (cleanNumber.includes('M')) {
        const num = parseFloat(cleanNumber.replace('M', ''));
        return Math.round(num * 1000000);
      }
      if (cleanNumber.includes('B')) {
        const num = parseFloat(cleanNumber.replace('B', ''));
        return Math.round(num * 1000000000);
      }
    }
    
    // Si tiene comas o puntos, removerlos y convertir a número
    let numericString = cleanNumber.replace(/[,.]/g, '');
    return parseInt(numericString) || 0;
  }

  /**
   * Obtiene o crea instancia del browser
   */
  async getBrowser() {
    if (this.browser) {
      try {
        // Verificar que el browser siga activo
        await this.browser.version();
        return this.browser;
      } catch (e) {
        console.log('⚠️ Browser desconectado, creando nuevo...');
        this.browser = null;
      }
    }

    if (this.isConnecting) {
      // Esperar si ya se está conectando
      let attempts = 0;
      while (!this.browser && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      return this.browser;
    }

    this.isConnecting = true;
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      return this.browser;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Extrae el número de viewers de una URL
   */
  async getYouTubeViewers(url) {
    let page;
    
    try {
      console.log(`📺 Extrayendo viewers de YouTube: ${url.substring(0, 50)}...`);
      
      const browser = await this.getBrowser();
      page = await browser.newPage();
      
      // Descartar logs
      page.on('error', err => console.error('Error en página:', err));
      page.on('pageerror', err => console.error('Error JS:', err));

      console.log(`🌐 Navegando a YouTube...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 9000 });

      console.log(`✅ Página cargada`);

      // IMPORTANTE: Esperar a que YouTube cargue el contador dinámicamente
      console.log(`⏳ Esperando 5 segundos para que cargue el contador...`);
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Extrae viewers - LÓGICA EXACTA DE monitoreo-youtube.js
      const viewers = await page.evaluate(() => {
        // Buscar en todos los yt-formatted-string
        const elements = document.querySelectorAll('yt-formatted-string, span, div');
        
        for (let el of elements) {
          const text = el.textContent.trim();
          // Buscar patrones como "8,278 watching" o "1.2K watching"
          if ((text.includes('watching') || text.includes('viendo')) && /[\d,.KMB]+/.test(text)) {
            // Capturar número completo (incluyendo comas y puntos)
            const match = text.match(/([\d,.]+\s*[KMB]*)\s*(watching|viendo)/i);
            if (match && match[1]) {
              return match[1].trim();
            }
          }
        }
        
        // Si no encuentra con "watching", busca por aria-label
        const ariaLabelElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
        if (ariaLabelElements.length > 0) {
          const text = ariaLabelElements[0].getAttribute('aria-label');
          const match = text.match(/([\d,.]+\s*[KMB]*)/);
          if (match && match[1]) {
            return match[1].trim();
          }
        }
        
        return 'No disponible';
      });
      
      const viewerCount = this.parseViewerCount(viewers);
      console.log(`📊 Viewers obtenidos: ${viewers} (${viewerCount} numérico)\n`);
      
      if (page) {
        try { await page.close(); } catch (e) { }
      }
      
      return viewerCount;
      
    } catch (error) {
      console.error(`❌ Error YouTube:`, error.message);
      
      if (page) {
        try { await page.close(); } catch (e) { }
      }
      
      return 0;
    }
  }

  /**
   * Obtiene viewers de múltiples URLs EN PARALELO
   * @param {object} channels - { nombreCanal: "url", ... }
   * @returns {Promise<object>} { nombreCanal: viewers, ... }
   */
  async getViewersMultiple(channels) {
    try {
      const results = {};
      const channelEntries = Object.entries(channels);
      
      console.log(`\n🔄 YOUTUBE: Procesando ${channelEntries.length} canales...`);
      
      // Ejecutar con límite de concurrencia (máx 3 simultáneos para evitar sobrecargar)
      const chunkSize = 3;
      for (let i = 0; i < channelEntries.length; i += chunkSize) {
        const chunk = channelEntries.slice(i, i + chunkSize);
        
        const promises = chunk.map(async ([channelName, url]) => {
          try {
            console.log(`  🔗 YouTube ${channelName}...`);
            const viewers = await this.getYouTubeViewers(url);
            results[channelName] = viewers;
          } catch (error) {
            console.error(`  ❌ Error YouTube ${channelName}:`, error.message);
            results[channelName] = 0;
          }
        });
        
        await Promise.all(promises);
      }
      
      console.log(`✅ YouTube completado\n`);
      return results;
      
    } catch (error) {
      console.error('❌ Error crítico en YouTube:', error.message);
      return {};
    }
  }

  /**
   * Cierra el browser
   */
  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
      } catch (e) {
        console.error('Error cerrando browser:', e.message);
      }
    }
  }
}

// Forzar una sola instancia del servicio
const youtubeService = new YouTubeService();

/**
 * Función simple para obtener viewers de YouTube
 */
async function getYouTubeViewers(url) {
  return youtubeService.getYouTubeViewers(url);
}

/**
 * Función simple para obtener viewers de múltiples canales
 */
async function getYouTubeViewersMultiple(channels) {
  return youtubeService.getViewersMultiple(channels);
}

module.exports = {
  getYouTubeViewers,
  getYouTubeViewersMultiple
};
