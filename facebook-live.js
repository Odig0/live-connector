// MONITOREO FACEBOOK LIVE CON PUPPETEER (Sin Login)
// Requiere: npm install puppeteer

const puppeteer = require('puppeteer');

console.log('👍 MONITOREO FACEBOOK LIVE (CON PUPPETEER)\n');

const FACEBOOK_URL = 'https://www.facebook.com/Reuters/videos/2360655077780439/';

console.log(`🔗 Accediendo a: ${FACEBOOK_URL}\n`);
console.log('⏳ Esperando que cargue Facebook...\n');

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

        console.log('🌐 Cargando Facebook...');
        await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle2', timeout: 30000 });

        console.log('✅ Página cargada!\n');

        // Esperar a que carguen los elementos
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extraer viewers iniciales
        const viewers = await page.evaluate(() => {
            // Buscar en los elementos de Facebook que muestran viewers
            const elements = document.querySelectorAll('span, div');
            
            for (let el of elements) {
                const text = el.textContent.trim();
                // Buscar patrones como "84 watching" o "1.2K people watching"
                if ((text.includes('watching') || text.includes('personas viendo') || text.includes('watching now')) && /[\d,.KMB]+/.test(text)) {
                    const match = text.match(/([\d,.]+[KMB]*)\s*(watching|watching now|personas viendo|people watching)/i);
                    if (match && match[1] !== '0') return match[1];
                }
            }
            
            // Alternativa: buscar en aria-labels
            const ariaElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
            if (ariaElements.length > 0) {
                const match = ariaElements[0].ariaLabel.match(/([\d,.]+[KMB]*)/);
                if (match) return match[1];
            }
            
            return 'No disponible';
        });

        console.log(`📊 Viewers en vivo: ${viewers}\n`);

        // Monitorear: RECARGA la página cada 15 segundos para obtener datos frescos
        setInterval(async () => {
            try {
                console.log('🔄 Recargando página para actualizar datos...');
                
                // RECARGAR LA PÁGINA COMPLETAMENTE
                await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
                
                // Esperar a que carguen los elementos
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Extraer viewers nuevos
                const newViewers = await page.evaluate(() => {
                    const elements = document.querySelectorAll('span, div');
                    
                    for (let el of elements) {
                        const text = el.textContent.trim();
                        if ((text.includes('watching') || text.includes('personas viendo') || text.includes('watching now')) && /[\d,.KMB]+/.test(text)) {
                            const match = text.match(/([\d,.]+[KMB]*)\s*(watching|watching now|personas viendo|people watching)/i);
                            if (match && match[1] !== '0') return match[1];
                        }
                    }
                    
                    const ariaElements = document.querySelectorAll('[aria-label*="watching"], [aria-label*="viendo"]');
                    if (ariaElements.length > 0) {
                        const match = ariaElements[0].ariaLabel.match(/([\d,.]+[KMB]*)/);
                        if (match) return match[1];
                    }
                    
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
