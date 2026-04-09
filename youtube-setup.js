// MONITOREO YOUTUBE - SIN API KEY (con Puppeteer)
// En instalación: npm install puppeteer

console.log('📺 MONITOREO YOUTUBE (Sin API Key)\n');

const VIDEO_ID = 'oxT5R6I0N6E';
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

console.log(`🔗 URL: ${VIDEO_URL}\n`);

// Comparar con alternativas
console.log('⚠️  OPCIONES:\n');

console.log('1️⃣  USANDO PUPPETEER (Recomendado):');
console.log('   npm install puppeteer');
console.log('   Simula un navegador real - MÁS CONFIABLE\n');

console.log('2️⃣  USANDO API KEY DE YOUTUBE:');
console.log('   Pasos:');
console.log('   a) Ir a: https://console.cloud.google.com');
console.log('   b) Crear proyecto nuevo');
console.log('   c) Habilitar "YouTube Data API v3"');
console.log('   d) Crear "API Key"');
console.log('   e) Usar en el script\n');

console.log('3️⃣  USANDO TIKTOK + YOUTUBE COMBINADOS:');
console.log('   node monitoreo-3.js (TikTok)');
console.log('   node youtube-puppeteer.js (YouTube)\n');

console.log('═'.repeat(50));

console.log('\n📝 Próximo paso:');
console.log('   Espera a que Puppeteer termine de instalar...');
console.log('   Esto puede tardar 2-5 minutos\n');

console.log('   O ejecuta:');
console.log('   node youtube-puppeteer.js\n');
