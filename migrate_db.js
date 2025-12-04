const db = require('./anongard-backend/database_connection');

async function migrate() {
    try {
        console.log('Iniciando migración...');

        // Definir las columnas a agregar
        // Eliminamos IF NOT EXISTS para mayor compatibilidad y manejamos el error de columna duplicada
        const columns = [
            { name: 'guardar_historial', query: "ALTER TABLE salas_debate ADD COLUMN guardar_historial TINYINT(1) NOT NULL DEFAULT 1;" },
            { name: 'generar_pdf', query: "ALTER TABLE salas_debate ADD COLUMN generar_pdf TINYINT(1) NOT NULL DEFAULT 0;" },
            { name: 'acuerdo_alcanzado', query: "ALTER TABLE salas_debate ADD COLUMN acuerdo_alcanzado TEXT;" },
            { name: 'duracion_real', query: "ALTER TABLE salas_debate ADD COLUMN duracion_real INT;" }
        ];

        for (const col of columns) {
            try {
                await db.query(col.query);
                console.log(`Columna agregada: ${col.name}`);
            } catch (err) {
                // Error 1060: Duplicate column name
                if (err.errno === 1060) {
                    console.log(`La columna ${col.name} ya existe. Saltando...`);
                } else {
                    throw err;
                }
            }
        }

        console.log('Migración completada exitosamente.');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
}

migrate();
