const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

const tiktokUsername = 'zelikafb';

console.log(`🔗 Conectando al live de @${tiktokUsername}...\n`);

const connection = new TikTokLiveConnection(tiktokUsername, {
    processInitialData: false,
    enableExtendedGiftInfo: false,
    fetchRoomInfoOnConnect: false,
    disableEulerFallbacks: true,
    requestPollingIntervalMs: 2000
});

connection.connect().then(state => {
    console.log(`✅ Conectado exitosamente`);
    console.log(`Room ID: ${state.roomId}\n`);
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});

// Mostrar espectadores
connection.on(WebcastEvent.ROOM_USER, (data) => {
    if (data.userCount) {
        process.stdout.write(`\r📊 Espectadores: ${data.userCount}`);
    }
});

connection.on(ControlEvent.DISCONNECTED, () => {
    console.log('\n🔌 Desconectado');
});

connection.on(ControlEvent.ERROR, (err) => {
    console.error('\n⚠️ Error:', err);
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo...');
    connection.disconnect();
    setTimeout(() => process.exit(0), 500);
});
