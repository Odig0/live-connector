const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

const tiktokUsername = 'zelikafb';

console.log(`🔗 Conectando al live de @${tiktokUsername}...`);

const connection = new TikTokLiveConnection(tiktokUsername);

connection.connect().then(state => {
    console.log(`✅ Conectado!\n`);
}).catch(err => {
    console.error('❌ Error:', err.message);
});

connection.on(WebcastEvent.ROOM_USER, (data) => {
    process.stdout.write(`\r📊 Espectadores: ${data.viewerCount }`);
});

connection.on(ControlEvent.DISCONNECTED, () => {
    console.log('\n🔌 Desconectado');
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo...');
    connection.disconnect();
    process.exit(0);
});
