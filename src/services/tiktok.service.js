/**
 * Servicio para obtener viewers de TikTok Live
 * ⭐ VERSIÓN MEJORADA: Conexiones persistentes (no se crea/cierra constantemente)
 */

const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('../../dist/index.js');

// 🔌 Cache de conexiones persistentes
const persistentConnections = {};

/**
 * Obtiene o crea una conexión persistente a un canal TikTok
 * @param {string} channel - Nombre del canal
 * @returns {object} Conexión y estadísticas
 */
function getPersistentConnection(channel) {
  if (persistentConnections[channel]) {
    return persistentConnections[channel];
  }
  
  // Crear nueva conexión persistente
  const connection = new TikTokLiveConnection(channel);
  
  const stats = {
    channel,
    viewers: 0,
    conectado: false,
    roomId: null,
    hearts: 0,
    ultimaActualizacion: null,
    connection
  };
  
  // ✅ Conectar (y mantener abierta)
  connection.connect().then(state => {
    stats.conectado = true;
    stats.roomId = state.roomId;
    console.log(`✅ TikTok @${channel} conectado (Room: ${state.roomId})`);
  }).catch(err => {
    console.error(`❌ Error conectando @${channel}: ${err.message}`);
  });
  
  // 📊 Escuchar viewers EN TIEMPO REAL
  connection.on(WebcastEvent.ROOM_USER, (data) => {
    stats.viewers = data.viewerCount || 0;
    stats.ultimaActualizacion = new Date().toLocaleTimeString();
  });
  
  // ❤️ Contar hearts
  connection.on(WebcastEvent.LIKE, (data) => {
    stats.hearts += data.likeCount || 1;
  });
  
  // ⚠️ Manejo de errores
  connection.on(ControlEvent.ERROR, (err) => {
    console.error(`\n❌ Error TikTok @${channel}: ${err.message}`);
    console.log('⏳ Reconectando en 5 segundos...\n');
    
    setTimeout(() => {
      connection.connect().catch(e => console.error('Error reconectando:', e.message));
    }, 5000);
  });
  
  // 🔴 Desconexión
  connection.on(ControlEvent.DISCONNECTED, () => {
    stats.conectado = false;
    console.log(`⚫ TikTok @${channel} desconectado. Reintentando...\n`);
  });
  
  persistentConnections[channel] = stats;
  return stats;
}

/**
 * Obtiene el número de viewers de un canal TikTok (usa conexión persistente)
 * @param {string} channel - Nombre del canal TikTok
 * @returns {number} Número de viewers
 */
function getTikTokViewers(channel) {
  const stats = getPersistentConnection(channel);
  return stats.viewers;
}

/**
 * Obtiene viewers de múltiples canales (SECUENCIAL con delays - no paralelo)
 * ⭐ NO usa Promise.all() para evitar bloqueos
 * @param {object} channels - Objeto { nombreCanal: "usuarioTikTok", ... }
 * @returns {Promise<object>} { nombreCanal: viewers, ... }
 */
async function getTikTokViewersMultiple(channels) {
  try {
    const results = {};
    
    // 🔑 SECUENCIAL (no paralelo) con delays anti-bloqueo
    for (const [channelName, tiktokUser] of Object.entries(channels)) {
      try {
        console.log(`🔄 Obteniendo TikTok para ${channelName}...`);
        
        const viewers = getTikTokViewers(tiktokUser);
        results[channelName] = viewers;
        
        // 🔥 Pausa anti-bloqueo (1.5 segundos entre canales)
        await new Promise(r => setTimeout(r, 1500));
      } catch (error) {
        console.error(`❌ Error TikTok ${channelName}:`, error.message);
        results[channelName] = 0;
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Error en getTikTokViewersMultiple:', error.message);
    throw error;
  }
}

/**
 * Desconecta un canal específico
 * @param {string} channel 
 */
function disconnectChannel(channel) {
  if (persistentConnections[channel]) {
    persistentConnections[channel].connection.disconnect();
    delete persistentConnections[channel];
    console.log(`✅ Desconectado: @${channel}`);
  }
}

/**
 * Desconecta todos los canales
 */
function disconnectAll() {
  Object.keys(persistentConnections).forEach(channel => {
    try {
      persistentConnections[channel].connection.disconnect();
    } catch (e) {}
  });
  Object.keys(persistentConnections).forEach(k => delete persistentConnections[k]);
  console.log('✅ Todos los canales desconectados');
}


module.exports = {
  getTikTokViewers,
  getTikTokViewersMultiple,
  getPersistentConnection,
  disconnectChannel,
  disconnectAll
};
