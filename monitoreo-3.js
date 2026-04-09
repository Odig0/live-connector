const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

// Canales a monitorear
const canales = ['zelikafb', 'rqpbolivia', 'wunder_ff'];

// Estadísticas de cada canal
const stats = {};
canales.forEach(canal => {
    stats[canal] = { viewers: 0, conectado: false };
});

console.log(`🔗 Conectando a ${canales.length} canales...\n`);

// Crear conexión para cada canal
canales.forEach(canal => {
    const connection = new TikTokLiveConnection(canal);

    connection.connect().then(state => {
        stats[canal].conectado = true;
        console.log(`✅ @${canal} conectado (Room: ${state.roomId})`);
    }).catch(err => {
        console.log(`❌ @${canal}: ${err.message}`);
    });

    // Actualizar espectadores
    connection.on(WebcastEvent.ROOM_USER, (data) => {
        stats[canal].viewers = data.viewerCount ;
    });

    // Desconexión
    connection.on(ControlEvent.DISCONNECTED, () => {
        stats[canal].conectado = false;
    });

    // Guardar conexión para desconectar después
    stats[canal].connection = connection;
});

// Mostrar estadísticas cada 2 segundos
console.log('');
setInterval(() => {
    console.clear();
    console.log('📊 MONITOREO DE TIKTOK LIVE\n');
    console.log('═'.repeat(40));
    
    canales.forEach(canal => {
        const s = stats[canal];
        const estado = s.conectado ? '🔴 VIVO' : '⚫ OFFLINE';
        console.log(`\n@${canal}`);
        console.log(`  Estado: ${estado}`);
        console.log(`  Viewers: ${s.viewers}`);
    });
    
    console.log('\n' + '═'.repeat(40));
    console.log('Ctrl+C para detener\n');
}, 2000);

// Detener todas las conexiones
process.on('SIGINT', () => {
    console.log('\n\n🛑 Desconectando...');
    canales.forEach(canal => {
        stats[canal].connection.disconnect();
    });
    setTimeout(() => process.exit(0), 500);
});
