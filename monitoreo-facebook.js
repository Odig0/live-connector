// MONITOREO FACEBOOK LIVE CON PUPPETEER (Sin Login)
// Requiere: npm install puppeteer

const puppeteer = require('puppeteer');

console.log('👍 MONITOREO FACEBOOK LIVE (CON PUPPETEER)\n');

const FACEBOOK_URL = 'https://www.facebook.com/PSLLIVEMATCH2026A/videos/1681517729865699?locale=es_LA';

console.log(`🔗 Accediendo a: ${FACEBOOK_URL}\n`);
console.log('⏳ Esperando que cargue Facebook...\n');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-resources',  // Carga más rápido
                '--disable-background-networking'
            ]
        });

        const page = await browser.newPage();
        
        // Establecer user agent para que Facebook no nos bloquee
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Viewport más realista
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Descartar logs
        page.on('error', err => console.error('Error en página:', err));
        page.on('pageerror', err => console.error('Error JS:', err));
        
        // Capturar logs del navegador
        page.on('console', msg => {
            if (msg.text().includes('DEBUG')) {
                console.log('  ' + msg.text());
            }
        });

        console.log('🌐 Cargando Facebook...');
        await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle2', timeout: 30000 });

        console.log('✅ Página cargada!\n');

        // Esperar a que carguen los elementos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // INTENTAR CERRAR EL MODAL DE LOGIN si aparece
        try {
            // Buscar y cerrar modal
            const closeButton = await page.$('[aria-label="Cerrar"], [aria-label="Close"], button[aria-label*="close"]');
            if (closeButton) {
                console.log('🚫 Detectado modal de login, intentando cerrarlo...');
                await closeButton.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } catch (e) {
            console.log('ℹ️ No se encontró modal de login (es normal)');
        }
        
        // SCREENSHOT para DEBUG
        await page.screenshot({ path: 'facebook-debug.png' });
        console.log('📸 Screenshot guardado: facebook-debug.png\n');

        // Extraer viewers iniciales CON MÁS OPCIONES DE BÚSQUEDA
        const viewers = await page.evaluate(() => {
            // MÉTODO 1: Si es un video grabado, buscar en el header "transmitió en vivo hace X tiempo"
            const allText = document.body.innerText;
            
            // Para videos en VIVO
            const liveMatch = allText.match(/(\d+[,.KMB]*)\s+(people\s+)?watching|(\d+[,.KMB]*)\s+viendo/i);
            if (liveMatch) return { type: 'live', value: liveMatch[1] || liveMatch[3] };
            
            // Para VIDEOS GRABADOS - buscar el texto "transmitió en vivo"
            const broadcastMatch = allText.match(/transmitió en vivo.*?(\d+\s*[a-z])/i);
            if (broadcastMatch) {
                return { type: 'video-info', value: 'pasado', time: broadcastMatch[1] };
            }
            
            // MÉTODO 2: Buscar reacciones (likes)
            const elements = document.querySelectorAll('span, div');
            for (let el of elements) {
                const text = el.textContent.trim();
                // Buscar patrones numéricos grandes (views, likes, comments)
                if (/^\d+[,.]*\s*[KM]?$/i.test(text) && parseInt(text.replace(/[,.KM]/g, '')) > 100) {
                    const num = text.replace(/\s/g, '');
                    if (!num.includes('20') && !num.includes('19')) { // Evitar años
                        return { type: 'metric', value: text };
                    }
                }
            }
            
            return { type: 'unknown', value: 'No disponible' };
        });
        
        // Procesar resultado
        let displayText = 'No disponible';
        let videoStatus = '❌ Offline';
        
        if (viewers.type === 'live') {
            displayText = viewers.value;
            videoStatus = '🔴 EN VIVO';
        } else if (viewers.type === 'video-info') {
            displayText = `Video grabado hace ${viewers.time}`;
            videoStatus = '⏱️ GRABADO';
        } else if (viewers.type === 'metric') {
            displayText = viewers.value;
            videoStatus = '📊 ESTADÍSTICAS';
        }
        
        console.log(`${videoStatus}: ${displayText}\n`);
        setInterval(async () => {
            try {
                console.log('🔄 Recargando página para actualizar datos...');
                
                // RECARGAR LA PÁGINA COMPLETAMENTE
                await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
                
                // Esperar a que carguen los elementos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Extraer viewers nuevos CON MÁS OPCIONES
                const newViewers = await page.evaluate(() => {
                    const elements = document.querySelectorAll('span, div, a, p');
                    
                    for (let el of elements) {
                        const text = el.textContent.trim();
                        if ((text.includes('watching') || text.includes('personas viendo') || text.includes('watching now') || text.includes('viendo')) && /[\d,.KMB]+/.test(text)) {
                            const match = text.match(/([\d,.]+[KMB]*)\s*(watching|watching now|personas viendo|people watching|viendo)/i);
                            if (match && match[1] !== '0') return match[1];
                        }
                    }
                    
                    const ariaElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
                    if (ariaElements.length > 0) {
                        const text = ariaElements[0].getAttribute('aria-label');
                        const match = text.match(/([\d,.]+[KMB]*)/);
                        if (match) return match[1];
                    }
                    
                    const dataElements = document.querySelectorAll('[data-testid*="viewers"], [data-testid*="watching"]');
                    if (dataElements.length > 0) {
                        return dataElements[0].textContent.trim();
                    }
                    
                    const videoInfo = document.querySelectorAll('[role="article"] span, [role="main"] span');
                    for (let el of videoInfo) {
                        const text = el.textContent.trim();
                        if (/^\d+/.test(text) && (text.includes('watching') || text.includes('viendo'))) {
                            return text;
                        }
                    }
                    
                    const allText = document.body.innerText;
                    const viewerMatch = allText.match(/(\d+[,.KMB]*)\s+(people\s+)?watching/i) || 
                                       allText.match(/(\d+[,.KMB]*)\s+(personas\s+)?viendo/i);
                    if (viewerMatch) return viewerMatch[1];
                    
                    return 'No disponible';
                });

                console.log(`✅ Viewers ACTUALIZADO: ${newViewers}\n`);
            } catch (e) {
                console.error('\n❌ Error al actualizar:', e.message);
            }
        }, 15000);

        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Cerrando...');
            await browser.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Soluciones:');
        console.log('   - Verifica que Puppeteer esté instalado: npm install puppeteer');
        console.log('   - Verifica que el video de Facebook esté en vivo');
        console.log('   - Verifica tu conexión a internet\n');
        
        if (browser) await browser.close();
        process.exit(1);
    }
})();
