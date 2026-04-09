const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('./dist/index.js');

// Canales a monitorear
const canales = ['zelikafb', 'rqpbolivia', 'wunder_ff'];

// Almacenar conexiones y estadísticas
const conexiones = {};
const estadisticas = {};

// Inicializar estadísticas para cada canal
canales.forEach(canal => {
    estadisticas[canal] = {
        viewers: 0,
        conectado: false
    };
});

console.log(`🔗 Inicializando monitoreo de ${canales.length} canales...\n`);

// Crear conexión para cada canal
canales.forEach(canal => {
    const connection = new TikTokLiveConnection(canal, {
        processInitialData: false,
        enableExtendedGiftInfo: false,
        fetchRoomInfoOnConnect: true,
        disableEulerFallbacks: true
    });

    conexiones[canal] = connection;

    // Verificar si está en vivo
    connection.fetchIsLive().then(isLive => {
        if (isLive) {
            console.log(`✅ @${canal} está EN VIVO`);
            
            // Conectar
            connection.connect().then(state => {
                estadisticas[canal].conectado = true;
                if (state.roomInfo?.stats?.userCount) {
                    estadisticas[canal].viewers = state.roomInfo.stats.userCount;
                }
            }).catch(err => {
                console.error(`❌ Error conectando a @${canal}: ${err.message}`);
            });
        } else {
            console.log(`⏸️  @${canal} NO está en vivo`);
        }
    }).catch(err => {
        console.log(`⚠️  @${canal} - Error al verificar: ${err.message}`);
    });

    // Evento de espectadores
    connection.on(WebcastEvent.ROOM_USER, (data) => {
        if (data.userCount) {
            estadisticas[canal].viewers = data.userCount;
        }
    });

    // Desconexión
    connection.on(ControlEvent.DISCONNECTED, () => {
        estadisticas[canal].conectado = false;
        console.log(`\n🔌 @${canal} desconectado`);
    });

    // Errores
    connection.on(ControlEvent.ERROR, (err) => {
        console.error(`\n⚠️  @${canal} Error: ${err.message}`);
    });
});

// Mostrar estadísticas cada 3 segundos
setInterval(() => {
    console.clear();
    console.log('📊 MONITOREO DE CANALES TIKTOK\n');
    console.log('═'.repeat(50));
    
    canales.forEach(canal => {
        const stats = estadisticas[canal];
        const estado = stats.conectado ? '🔴 VIVO' : '⚫ OFFLINE';
        const viewers = stats.viewerCount ;
        console.log(`\n@${canal}`);
        console.log(`  Estado: ${estado}`);
        console.log(`  Espectadores: ${viewers}`);
    });
    
    console.log('\n' + '═'.repeat(50));
    console.log('Presiona Ctrl+C para detener\n');
}, 3000);

// Detener todas las conexiones
process.on('SIGINT', () => {
    console.log('\n\n🛑 Desconectando todos los canales...');
    Object.values(conexiones).forEach(conn => {
        conn.disconnect();
    });
    setTimeout(() => process.exit(0), 1000);
});
