const db = require('./anongard-backend/database_connection');

async function check() {
    try {
        console.log('Verificando últimas salas...');

        const [salas] = await db.query(`
            SELECT id, titulo, estado, guardar_historial, generar_pdf, creador_id 
            FROM salas_debate 
            ORDER BY id DESC 
            LIMIT 5
        `);

        console.log('Salas encontradas:', salas);

        if (salas.length > 0) {
            const lastId = salas[0].id;
            console.log(`Verificando participantes para la sala ${lastId}...`);
            const [parts] = await db.query(`
                SELECT * FROM participantes_sala WHERE sala_id = ?
            `, [lastId]);
            console.log('Participantes:', parts);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
