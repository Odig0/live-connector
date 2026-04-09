#!/usr/bin/env node

/**
 * Test de verificación del API
 * 
 * Uso:
 *   node test-api.js
 * 
 * Este script verifica que todo esté correcto y hace un test al endpoint
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log(`\n╔════════════════════════════════════════════╗`);
console.log(`║     TEST DE VERIFICACIÓN - API v1.0       ║`);
console.log(`╚════════════════════════════════════════════╝\n`);

// ============================================================================
// PASO 1: Verificar archivos
// ============================================================================
console.log(`📋 PASO 1: Verificando archivos necesarios...\n`);

const requiredFiles = [
  'server.js',
  'app.js',
  '.env',
  'src/services/tiktok.service.js',
  'src/services/facebook.service.js',
  'src/services/youtube.service.js',
  'src/controllers/views.controller.js',
  'src/routes/views.routes.js'
];

let allFilesExist = true;

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
  if (!exists) allFilesExist = false;
}

if (!allFilesExist) {
  console.log(`\n❌ Faltan archivos. Ejecucha de nuevo o revisa el setup.`);
  process.exit(1);
}

console.log(`\n✅ Todos los archivos existen!\n`);

// ============================================================================
// PASO 2: Verificar contenido de archivos clave
// ============================================================================
console.log(`📋 PASO 2: Verificando contenido de archivos...\n`);

try {
  const serverContent = fs.readFileSync('server.js', 'utf8');
  if (serverContent.includes('CHANNELS_CONFIG')) {
    console.log(`  ✅ server.js configure CHANNELS_CONFIG`);
  } else {
    console.log(`  ❌ server.js no tiene CHANNELS_CONFIG`);
  }

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.dependencies.express) {
    console.log(`  ✅ Express en dependencies`);
  } else {
    console.log(`  ❌ Express NO está en dependencies`);
  }

  if (packageJson.scripts.server) {
    console.log(`  ✅ Script "npm run server" disponible`);
  } else {
    console.log(`  ❌ Script "npm run server" NO disponible`);
  }
} catch (err) {
  console.log(`  ❌ Error leyendo archivos:`, err.message);
  process.exit(1);
}

console.log();

// ============================================================================
// PASO 3: Verificar que el servidor está corriendo
// ============================================================================
console.log(`📋 PASO 3: Verificando que Express esté instalado...\n`);

try {
  require('express');
  console.log(`  ✅ Express instalado correctamente`);
} catch (err) {
  console.log(`  ❌ Express NO está instalado`);
  console.log(`\n💡 Solución: npm install\n`);
  process.exit(1);
}

console.log();

// ============================================================================
// PASO 4: Intentar conectar al endpoint
// ============================================================================
console.log(`📋 PASO 4: Intentando conectar al endpoint...\n`);
console.log(`  📍 GET http://localhost:3000/api/views`);
console.log(`  ⏳ Esperando respuesta (timeout: 5s)...\n`);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/views',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.success && json.data) {
        console.log(`  ✅ Endpoint respondió correctamente!\n`);
        console.log(`  📊 Datos recibidos:`);
        console.log(`     ${JSON.stringify(json.data, null, 2).substring(0, 200)}...\n`);
        showFinal(true, 'El servidor está funcionando correctamente');
      } else {
        console.log(`  ⚠️  Respuesta recibida pero sin datos esperados\n`);
        console.log(`     ${data.substring(0, 200)}\n`);
        showFinal(false, 'Respuesta incompleta');
      }
    } catch (err) {
      console.log(`  ❌ Error parsing JSON: ${err.message}\n`);
      showFinal(false, 'Error en respuesta');
    }
  });
});

req.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log(`  ❌ Conexión rechazada\n`);
    console.log(`  💡 Soluciones:`);
    console.log(`     1. Verifica que el servidor esté corriendo: npm run server`);
    console.log(`     2. Verifica que PORT=3000 en .env`);
    console.log(`     3. Verifica que no hay otra app en puerto 3000\n`);
    showFinal(false, 'Servidor no está corriendo');
  } else {
    console.log(`  ❌ Error: ${err.message}\n`);
    showFinal(false, 'Error de conexión');
  }
});

req.on('timeout', () => {
  console.log(`  ❌ Timeout (el servidor tardó más de 5 segundos)\n`);
  showFinal(false, 'Timeout');
  process.exit(1);
});

req.end();

function showFinal(success, message) {
  console.log(`\n╔════════════════════════════════════════════╗`);
  if (success) {
    console.log(`║  ✅ TODO CORRECTO - API FUNCIONANDO       ║`);
  } else {
    console.log(`║  ⚠️  VERIFICAR - ${message.padEnd(25)} ║`);
  }
  console.log(`╚════════════════════════════════════════════╝\n`);

  if (success) {
    console.log(`📝 Próximos pasos:`);
    console.log(`   1. Edita server.js y configura CHANNELS_CONFIG`);
    console.log(`   2. Reinicia el servidor: npm run server`);
    console.log(`   3. Prueba el endpoint nuevamente\n`);
  }

  process.exit(success ? 0 : 1);
}
