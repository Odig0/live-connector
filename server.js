/**
 * Punto de entrada del servidor
 * 
 * Uso:
 *   node server.js
 *   
 *   El servidor estará disponible en: http://localhost:3000
 *   Endpoint: http://localhost:3000/api/views
 */

require('dotenv').config();

// Agregar error handling ANTES de importar app
console.log('📋 Iniciando carga de módulos...');

let app;
try {
  console.log('📦 Cargando app.js...');
  app = require('./app.js');
  console.log('✅ app.js cargado correctamente');
} catch (error) {
  console.error('❌ ERROR CRÍTICO al cargar app.js:');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// ============================================================================
// CONFIGURACIÓN DE CANALES
// ============================================================================
// EDITA ESTOS VALORES CON TUS CANALES REALES
const CHANNELS_CONFIG = {
  unitel: {
    name: 'Unitel',
    tiktok: 'zelikafb',
    facebook: 'https://www.facebook.com/Reuters/videos/2360655077780439/',
    youtube: 'https://www.youtube.com/watch?v=oxT5R6I0N6E'
  },
  bolivision: {
    name: 'Bolivisión',
    tiktok: 'rqpbolivia',
    facebook: 'https://www.facebook.com/watch/?v=YOUR_VIDEO_ID_2',
    youtube: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2'
  },
  eldeber: {
    name: 'El Deber',
    tiktok: 'wunder_ff',
    facebook: 'https://www.facebook.com/watch/?v=YOUR_VIDEO_ID_3',
    youtube: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3'
  }
};

// Pasar configuración al app
app.locals.channelsConfig = CHANNELS_CONFIG;

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║      Stream Views Monitor API - v1.0.0             ║
║════════════════════════════════════════════════════║
  🚀 Servidor iniciado
  🌐 URL: http://localhost:${PORT}
  📍 Ambiente: ${NODE_ENV}
  
  📍 ENDPOINTS:
     • POST http://localhost:${PORT}/api/views
     • GET http://localhost:${PORT}/api/health
  
  📝 Body esperado (POST):
     {
       "youtube": "https://www.youtube.com/watch?v=...",
       "tiktok": "usuario",
       "facebook": "https://www.facebook.com/..."
     }
  
  💡 Ejemplo con curl:
     curl -X POST http://localhost:${PORT}/api/views \\
       -H "Content-Type: application/json" \\
       -d '{"youtube":"https://www.youtube.com/watch?v=ewqlYX6fjLs",
           "tiktok":"anferlv",
           "facebook":"https://www.facebook.com/..."}'
     
  ⏹️  Presiona Ctrl+C para detener
╚════════════════════════════════════════════════════╝
  `);
});

// 🔍 Agregar listeners para debug
server.on('connection', (conn) => {
  console.log('✅ Nueva conexión recibida');
});

server.on('error', (err) => {
  console.error('❌ Error del servidor:', err.message);
  console.error('Stack:', err.stack);
});

server.on('close', () => {
  console.log('🔴 Servidor cerrado');
});

// 🔒 Prevenir que Node.js cierre el proceso
console.log('✅ Servidor listo. El proceso se mantendrá activo...');

// Opcional: Agregar un intervalo para mantener vivo el event loop
setInterval(() => {
  // Este intervalo es principalmente para depuración
  // Ayuda a mantener el event loop activo
}, 60000); // Cada minuto

// ============================================================================
// MANEJO DE SEÑALES
// ============================================================================

process.on('SIGINT', () => {
  console.log('\n\n⚠️  Señal SIGINT recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Señal SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:');
  console.error('Razón:', reason);
  console.error('Stack:', reason instanceof Error ? reason.stack : 'N/A');
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.log('⚠️  El proceso se cerrará...');
  process.exit(1);
});
