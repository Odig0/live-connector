const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

// Cambiar aquí el usuario que desees monitorear
const tiktokUsername = 'zelikafb';

console.log(`🔗 Conectando al live de @${tiktokUsername}...`);
console.log(`⏳ Esperando que inicie el live...\n`);

const connection = new TikTokLiveConnection(tiktokUsername, {
    processInitialData: false,
    enableExtendedGiftInfo: false,
    fetchRoomInfoOnConnect: true,
    disableEulerFallbacks: true,
    requestPollingIntervalMs: 1000  // Usa polling en lugar de WebSocket
});

// Evento de conexión exitosa
connection.on(ControlEvent.CONNECTED, (state) => {
    console.log(`✅ Conectado exitosamente\n`);
    if (state.roomInfo?.stats?.userCount) {
        console.log(`📊 Espectadores en vivo: ${state.roomInfo.stats.userCount}`);
    }
});

// Conectar
connection.connect().catch(err => {
    console.error('❌ Error de conexión:', err.message || err);
    process.exit(1);
});

// ROOM USER - Actualiza el conteo de espectadores
connection.on(WebcastEvent.ROOM_USER, (data) => {
    const viewers = data.userCount || 0;
    process.stdout.write(`\r📊 Espectadores en vivo: ${viewers}`);
});

// Cuando se desconecta
connection.on(ControlEvent.DISCONNECTED, (data) => {
    console.log(`\n🔌 Desconectado del live`);
});

// Errores
connection.on(ControlEvent.ERROR, (err) => {
    console.error('\n⚠️ Error:', err.message || err);
});

// Keep alive
process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo...');
    connection.disconnect();
    setTimeout(() => process.exit(0), 1000);
});
