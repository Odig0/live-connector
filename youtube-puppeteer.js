// MONITOREO YOUTUBE CON PUPPETEER (Sin API Key)
// Requiere: npm install puppeteer

const puppeteer = require('puppeteer');

console.log('📺 MONITOREO YOUTUBE (CON PUPPETEER)\n');

const VIDEO_ID = 'oxT5R6I0N6E';
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

console.log(`🔗 Accediendo a: ${VIDEO_URL}\n`);
console.log('⏳ Esperando que cargue YouTube...\n');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Descartar logs
        page.on('error', err => console.error('Error en página:', err));
        page.on('pageerror', err => console.error('Error JS:', err));

        console.log('🌐 Cargando YouTube...');
        await page.goto(VIDEO_URL, { waitUntil: 'networkidle2', timeout: 30000 });

        console.log('✅ Página cargada!\n');

        // Esperar a que carguen los elementos
        await new Promise(resolve => setTimeout(resolve, 2000));

        const viewers = await page.evaluate(() => {
            // Buscar en todos los yt-formatted-string
            const elements = document.querySelectorAll('yt-formatted-string, span, div');
            
            for (let el of elements) {
                const text = el.textContent.trim();
                // Buscar patrones como "1.2K watching" o "12345 watching now"
                if ((text.includes('watching') || text.includes('viendo')) && /[\d,.KMB]+/.test(text)) {
                    const match = text.match(/([\d,.]+[KMB]*)\s*(watching|viendo)/i);
                    if (match) return match[1];
                }
            }
            
            // Si no encuentra con "watching", busca por aria-label
            const ariaLabelElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
            if (ariaLabelElements.length > 0) {
                const match = ariaLabelElements[0].ariaLabel.match(/([\d,.]+[KMB]*)/);
                if (match) return match[1];
            }
            
            return 'No disponible';
        });

        console.log(`📊 Viewers en vivo: ${viewers}\n`);

        // Monitorear: RECARGA la página cada 15 segundos para obtener datos frescos
        setInterval(async () => {
            try {
                console.log('🔄 Recargando página para actualizar datos...');
                
                // RECARGAR LA PÁGINA COMPLETAMENTE para obtener nuevos datos
                await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
                
                // Esperar a que carguen los elementos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Extraer viewers nuevos
                const newViewers = await page.evaluate(() => {
                    const elements = document.querySelectorAll('yt-formatted-string, span, div');
                    
                    for (let el of elements) {
                        const text = el.textContent.trim();
                        if ((text.includes('watching') || text.includes('viendo')) && /[\d,.KMB]+/.test(text)) {
                            const match = text.match(/([\d,.]+[KMB]*)\s*(watching|viendo)/i);
                            if (match) return match[1];
                        }
                    }
                    
                    const ariaLabelElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
                    if (ariaLabelElements.length > 0) {
                        const match = ariaLabelElements[0].ariaLabel.match(/([\d,.]+[KMB]*)/);
                        if (match) return match[1];
                    }
                    
                    return 'No disponible';
                });

                console.log(`✅ Viewers ACTUALIZADO: ${newViewers}\n`);
            } catch (e) {
                console.error('\n❌ Error al actualizar:', e.message);
            }
        }, 10000);

        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Cerrando...');
            await browser.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Soluciones:');
        console.log('   - Verifica que Puppeteer esté instalado: npm install puppeteer');
        console.log('   - Intenta ejecutar nuevamente');
        console.log('   - Verifica tu conexión a internet\n');
        
        if (browser) await browser.close();
        process.exit(1);
    }
})();
