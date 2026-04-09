// MONITOREO YOUTUBE
// Requiere: npm install youtube-live-chat

try {
    const YouTube_LiveChat = require('youtube-live-chat');

    console.log('📺 MONITOREO YOUTUBE\n');

    const VIDEO_ID = 'oxT5R6I0N6E';

    console.log(`🔗 Conectando a YouTube (Video: ${VIDEO_ID})...\n`);

    const chat = new YouTube_LiveChat({ 
        id: VIDEO_ID,
        hl: 'es'
    });

    let messageCount = 0;
    let viewers = 0;

    chat.on('message', (message) => {
        messageCount++;
        const author = message.author?.name || 'Anónimo';
        console.log(`💬 ${author}: ${message.message}`);
    });

    chat.on('superchat', (superchat) => {
        const author = superchat.author?.name || 'Anónimo';
        console.log(`🎉 SUPERCHAT de ${author}`);
    });

    chat.on('viewerCount', (count) => {
        viewers = count;
        process.stdout.write(`\r👥 Viewers: ${viewers} | Mensajes: ${messageCount}`);
    });

    chat.on('error', (error) => {
        console.error('\n❌ Error de YouTube:', error.message || JSON.stringify(error));
        console.log('\n💡 Posibles soluciones:');
        console.log('   1. Verifica que el stream esté actualmente EN VIVO');
        console.log('   2. El VIDEO_ID podría ser incorrecto');
        console.log('   3. YouTube podría estar bloqueando la conexión');
        console.log('   4. Intenta reiniciar el script');
    });

    chat.on('end', () => {
        console.log('\n\n🔌 Stream finalizado');
        console.log(`📊 Total de mensajes: ${messageCount}`);
    });

    console.log('✅ Escuchando comentarios en vivo...\n');

    process.on('SIGINT', () => {
        console.log('\n\n🛑 Deteniendo...');
        try {
            chat.stop();
        } catch (e) {}
        process.exit(0);
    });

} catch (error) {
    console.error('❌ Error fatal:', error.message);
    console.log('\nIntenta:');
    console.log('  npm install youtube-live-chat');
    process.exit(1);
}
