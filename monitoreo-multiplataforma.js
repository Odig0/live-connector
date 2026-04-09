// MONITOREO TIKTOK + YOUTUBE + FACEBOOK
// Nota: Todavía está en prueba para YouTube

const { TikTokLiveConnection, WebcastEvent } = require('./dist/index.js');

console.log('🚀 MONITOREO MULTIPLATAFORMA\n');

// ============================================
// TIKTOK
// ============================================
console.log('🔗 Conectando a TIKTOK...\n');

const tiktokCanales = ['zelikafb', 'rqpbolivia', 'wunder_ff'];
const tiktokStats = {};

tiktokCanales.forEach(canal => {
    tiktokStats[canal] = { viewers: 0, conectado: false };
    
    const connection = new TikTokLiveConnection(canal);

    connection.connect().then(state => {
        tiktokStats[canal].conectado = true;
        console.log(`✅ TIKTOK @${canal} conectado`);
    }).catch(err => {
        console.log(`❌ TIKTOK @${canal}: ${err.message}`);
    });

    connection.on(WebcastEvent.ROOM_USER, (data) => {
        tiktokStats[canal].viewers = data.viewerCount || 0;
    });

    connection.on('disconnect', () => {
        tiktokStats[canal].conectado = false;
    });

    tiktokStats[canal].connection = connection;
});

// ============================================
// YOUTUBE (Prueba)
// ============================================
console.log('🔗 YouTube: Requiere video ID actualizado...');
console.log('   Ejemplo: node youtube-monitor.js\n');

// ============================================
// FACEBOOK (Prueba)
// ============================================
console.log('🔗 Facebook: Requiere credenciales...');
console.log('   Ejemplo: node facebook-monitor.js\n');

// Mostrar estadísticas
console.log('═'.repeat(50));
setInterval(() => {
    console.clear();
    console.log('📊 MONITOREO MULTIPLATAFORMA\n');
    console.log('═'.repeat(50));
    
    console.log('\n🎵 TIKTOK:');
    tiktokCanales.forEach(canal => {
        const s = tiktokStats[canal];
        const estado = s.conectado ? '🔴 VIVO' : '⚫ OFFLINE';
        console.log(`  @${canal}: ${estado} | Viewers: ${s.viewers}`);
    });
    
    console.log('\n📺 YOUTUBE: ⏳ Espera el script youtube-monitor.js');
    console.log('\n📘 FACEBOOK: ⏳ Espera el script facebook-monitor.js');
    
    console.log('\n' + '═'.repeat(50));
    console.log('Ctrl+C para detener\n');
}, 2000);

process.on('SIGINT', () => {
    console.log('\n\n🛑 Desconectando...');
    tiktokCanales.forEach(canal => {
        tiktokStats[canal].connection.disconnect();
    });
    setTimeout(() => process.exit(0), 500);
});
