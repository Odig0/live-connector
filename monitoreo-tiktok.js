const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

// ⭐ UNA SOLA CUENTA DE TIKTOK
const TIKTOK_USER = 'zelikafb'; // Cambia aquí el nombre de usuario

// 📊 Estadísticas
const stats = {
    viewers: 0,
    conectado: false,
    roomId: null,
    ligadoA: null,
    totalSpectadores: 0,
    hearts: 0,
    ultimaActualizacion: null
};

console.log(`👍 MONITOREO TIKTOK LIVE (CONEXIÓN PERSISTENTE)\n`);
console.log(`🔗 Usuario: @${TIKTOK_USER}\n`);
console.log('⏳ Conectando...\n');

// 🔌 Crear conexión única (PERSISTENTE)
const connection = new TikTokLiveConnection(TIKTOK_USER, {
    connectWithUniqueId: true // 🔑 Reduce bloqueos
});

// Conectar
connection.connect().then(state => {
    stats.conectado = true;
    stats.roomId = state.roomId;
    console.log(`✅ Conectado a @${TIKTOK_USER}`);
    console.log(`   Room ID: ${state.roomId}\n`);
}).catch(err => {
    console.error(`❌ Error de conexión: ${err.message}`);
    process.exit(1);
});

// 📊 Actualizar viewers EN TIEMPO REAL
connection.on(WebcastEvent.ROOM_USER, (data) => {
    stats.viewers = data.viewerCount;
    stats.ultimaActualizacion = new Date().toLocaleTimeString();
});

// ❤️ Contar hearts/likes
connection.on(WebcastEvent.LIKE, (data) => {
    stats.hearts += data.likeCount || 1;
});

// 👥 Usuarios que entran
connection.on(WebcastEvent.VIEWER_DATA, (data) => {
    stats.ligadoA = data.viewerCount;
});

// ⚠️ Errores
connection.on(ControlEvent.ERROR, (err) => {
    console.error(`\n❌ Error en conexión: ${err.message}`);
    console.log('⏳ Intentando reconectar en 5 segundos...\n');
    
    setTimeout(() => {
        connection.connect().catch(e => console.error('Error reconectando:', e.message));
    }, 5000);
});

// 🔴 Desconexión
connection.on(ControlEvent.DISCONNECTED, () => {
    stats.conectado = false;
    console.log('\n⚠️ Desconectado de TikTok. Intentando reconectar...\n');
});

// 📺 Mostrar estadísticas cada 2 segundos
console.log('');
setInterval(() => {
    console.clear();
    console.log('📊 MONITOREO TIKTOK LIVE (CONEXIÓN ÚNICA)\n');
    console.log('═'.repeat(50));
    
    const estado = stats.conectado ? '🔴 EN VIVO' : '⚫ OFFLINE';
    console.log(`${estado}`);
    console.log(`\n👤 @${TIKTOK_USER}`);
    console.log(`   Room ID: ${stats.roomId || 'N/A'}`);
    console.log(`\n📊 Estadísticas:`);
    console.log(`   Viewers: ${stats.viewers.toLocaleString()}`);
    console.log(`   Hearts: ${stats.hearts.toLocaleString()}`);
    console.log(`   Última actualización: ${stats.ultimaActualizacion || 'N/A'}`);
    
    console.log('\n' + '═'.repeat(50));
    console.log('💡 Conexión persistente - No se desconecta automáticamente');
    console.log('Ctrl+C para detener\n');
}, 2000);

// 🛑 Detener conexión
process.on('SIGINT', () => {
    console.log('\n\n🛑 Cerrando conexión...');
    connection.disconnect();
    setTimeout(() => {
        console.log('✅ Desconectado');
        process.exit(0);
    }, 500);
});
