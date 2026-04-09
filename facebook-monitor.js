// MONITOREO FACEBOOK LIVE
// Nota: Facebook requiere credenciales y es más complejo

console.log('📘 MONITOREO FACEBOOK LIVE\n');
console.log('⚠️  Facebook es más complicado por seguridad.\n');

console.log('OPCIONES:\n');

console.log('1️⃣  OPCIÓN A - Usar Puppeteer (Scraping):');
console.log('   npm install puppeteer');
console.log('   Simula un navegador para acceder a Facebook\n');

console.log('2️⃣  OPCIÓN B - Usar API oficial de Facebook:');
console.log('   Requiere: Access Token y App ID');
console.log('   https://developers.facebook.com/docs/live-video\n');

console.log('3️⃣  OPCIÓN C - Usar fb-chat (más simple):');
console.log('   npm install fb-chat');
console.log('   Para chats en vivo\n');

console.log('═'.repeat(50));

console.log('\n💡 Recomendación:');
console.log('   Para monitoreo de viewers en Facebook, la mejor opción');
console.log('   es usar la API oficial o Puppeteer.\n');

console.log('📝 Configuración necesaria:');
console.log('   - Email de Facebook');
console.log('   - Contraseña');
console.log('   - URL del live o ID del video\n');

// Ejemplo con Puppeteer
console.log('═'.repeat(50));
console.log('\nEJEMPLO CON PUPPETEER (cuando lo instales):\n');
console.log(`
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.facebook.com/tu-perfil/videos/LIVE');
  
  // Esperar y extraer el numero de viewers
  await page.waitForSelector('[aria-label*="viewers"]');
  const viewers = await page.$eval('[aria-label*="viewers"]', el => el.textContent);
  
  console.log('Viewers:', viewers);
  
  await browser.close();
})();
`);

console.log('\n⚠️  NOTA: Las credenciales NO deben ser compartidas en el código.');
console.log('   Usa variables de ambiente (.env)');
