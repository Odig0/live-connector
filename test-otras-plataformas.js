// PRUEBA: Monitoreando viewers en diferentes plataformas
// Nota: TikTok funciona con esta librería
//       YouTube y Facebook necesitarían librerías adicionales

const { TikTokLiveConnection, WebcastEvent } = require('./dist/index.js');

console.log('📱 MONITOREO MULTIPLATAFORMA\n');
console.log('✅ TikTok: DISPONIBLE (TikTok-Live-Connector)');
console.log('⚠️  YouTube: REQUIERE: youtube-chat');
console.log('⚠️  Facebook: MÁS COMPLEJO (requiere scraping)\n');

console.log('═'.repeat(50));
console.log('\nPARA AGREGAR YOUTUBE:');
console.log('  npm install youtube-chat');
console.log('\nPARA AGREGAR FACEBOOK:');
console.log('  npm install puppeteer facebook-api\n');

console.log('═'.repeat(50));
console.log('\nEJEMPLO - YOUTUBE (cuando instales youtube-chat):\n');
console.log(`
const YouTubeChat = require('youtube-chat').default;

const liveChatId = 'tu-room-id';
const chat = new YouTubeChat({ liveChatId });

chat.on('message', (message) => {
    console.log(\`\${message.author.name}: \${message.message}\`);
});

chat.start();
`);

console.log('\n═'.repeat(50));
console.log('\n¿Quieres que instale las librerías de YouTube/Facebook?');
console.log('Actualmente tienes funcionando: TikTok ✅');
