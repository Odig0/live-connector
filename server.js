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
const app = require('./app.js');

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
  
  � ENDPOINTS:
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
  console.error('❌ Promesa rechazada no manejada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});
