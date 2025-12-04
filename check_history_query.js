const db = require('./anongard-backend/database_connection');

async function checkHistory() {
    try {
        const userId = 6; // ID del usuario que vimos en check_db.js
        console.log(`Verificando historial para usuario ID: ${userId}...`);

        const query = `
            SELECT 
                s.id,
                s.titulo,
                s.descripcion,
                s.tipo_sala,
                s.creada_en,
                s.duracion_real,
                s.acuerdo_alcanzado,
                s.generar_pdf,
                COUNT(p2.id) as total_participantes,
                r.id as resumen_id
            FROM participantes_sala p
            JOIN salas_debate s ON p.sala_id = s.id
            LEFT JOIN participantes_sala p2 ON s.id = p2.sala_id
            LEFT JOIN resumenes r ON s.id = r.sala_id
            WHERE p.usuario_id = ? 
            AND s.estado = 'Finalizada'
            AND s.guardar_historial = 1
            GROUP BY s.id
            ORDER BY s.creada_en DESC
        `;

        const [rows] = await db.query(query, [userId]);
        console.log('Resultados de la query:', rows);

        process.exit(0);
    } catch (error) {
        console.error('Error en la query:', error);
        process.exit(1);
    }
}

checkHistory();
