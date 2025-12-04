const db = require('./anongard-backend/database_connection');

async function createTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS invitaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emisor_id INT NOT NULL,
                receptor_id INT NOT NULL,
                sala_id INT NOT NULL,
                estado ENUM('Pendiente', 'Aceptada', 'Rechazada') DEFAULT 'Pendiente',
                creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (emisor_id) REFERENCES users(id),
                FOREIGN KEY (receptor_id) REFERENCES users(id),
                FOREIGN KEY (sala_id) REFERENCES salas_debate(id)
            ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
        `);
        console.log('Tabla invitaciones creada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear tabla:', error);
        process.exit(1);
    }
}

createTable();
