require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SamlStrategy = require('passport-saml').Strategy;
const db = require('./database_connection');
const PDFDocument = require('pdfkit');

const app = express();

app.use(cors({
    origin: process.env.LOGIN_URL || 'http://localhost:5173', // Usa la variable del .env
    credentials: true, // Importante para que viajen las cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json()); // Para procesar JSON si envías datos desde el front

// Configuración de Sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // ✅ Cambiado a false (mejor práctica para login)
    cookie: {
        secure: false, // false para localhost (http), true si usas https
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuración de la Estrategia Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            console.log("✅ Perfil Google recibido:", profile.displayName);

            // Buscar si el usuario ya existe
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);

            if (rows.length > 0) {
                // Usuario ya existe, retornarlo
                return done(null, rows[0]);
            } else {
                // Usuario nuevo, crear registro parcial con foto de perfil
                const fotoPerfil = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

                const [result] = await db.query(
                    'INSERT INTO users (nombre, email, foto_perfil, registro_completo) VALUES (?, ?, ?, ?)',
                    [profile.displayName, profile.emails[0].value, fotoPerfil, 0]
                );

                // Obtener el usuario recién creado
                const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
                return done(null, newUser[0]);
            }
        } catch (error) {
            console.error('Error en Google OAuth:', error);
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0]);
    } catch (error) {
        done(error, null);
    }
});

// --- RUTAS ---

// 1. Iniciar Login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Callback de Google
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.LOGIN_URL }),
    function (req, res) {
        // Autenticación exitosa.
        console.log("🔄 Usuario autenticado:", req.user.nombre);

        // Verificar si el usuario completó el registro
        if (req.user.registro_completo === 0) {
            // Redirigir a completar registro
            res.redirect('http://localhost:5173/complete-registration');
        } else {
            // Redirigir al home
            res.redirect(process.env.HOME_URL);
        }
    }
);

app.get('/api/usuario-actual', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: req.user
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// Endpoint para completar el registro
app.post('/api/complete-registration', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const {
            fecha_nacimiento,
            comuna,
            rol,
            curso,
            numero_contacto,
            nombre_apoderado,
            numero_contacto_apoderado
        } = req.body;

        // Actualizar el usuario en la base de datos
        await db.query(
            `UPDATE users 
             SET fecha_nacimiento = ?, 
                 comuna = ?, 
                 rol = ?, 
                 curso = ?, 
                 numero_contacto = ?, 
                 nombre_apoderado = ?, 
                 numero_contacto_apoderado = ?, 
                 registro_completo = 1 
             WHERE id = ?`,
            [fecha_nacimiento, comuna, rol, curso, numero_contacto, nombre_apoderado, numero_contacto_apoderado, req.user.id]
        );

        // Obtener el usuario actualizado
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);

        res.json({
            success: true,
            message: 'Registro completado exitosamente',
            user: rows[0]
        });
    } catch (error) {
        console.error('Error al completar registro:', error);
        res.status(500).json({ error: 'Error al completar el registro' });
    }
});

// ========================================
// ENDPOINTS DE SALAS
// ========================================

// Obtener todas las salas con conteo de participantes
app.get('/api/salas', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id,
                s.titulo as name,
                s.descripcion as description,
                s.tipo_sala as type,
                s.estado as status,
                s.creador_id,
                s.creada_en,
                COUNT(p.id) as participants
            FROM salas_debate s
            LEFT JOIN participantes_sala p ON s.id = p.sala_id
            GROUP BY s.id
            ORDER BY s.creada_en DESC
        `;

        const [rows] = await db.query(query);

        // Transformar datos al formato esperado por el frontend
        const salas = rows.map(sala => ({
            id: `room-${sala.id}`,
            name: sala.name,
            description: sala.description,
            type: sala.type === 'General' ? 'general' : 'private',
            participants: sala.participants,
            status: sala.status === 'EnCurso' ? 'active' : 'scheduled',
            createdAt: sala.creada_en,
            creador_id: sala.creador_id
        }));

        res.json(salas);
    } catch (error) {
        console.error('Error al obtener salas:', error);
        res.status(500).json({ error: 'Error al obtener las salas' });
    }
});

// Crear nueva sala
app.post('/api/salas', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const {
            titulo,
            descripcion,
            tipo_sala,
            reglas,
            duracion_turno,
            saveToHistory,
            generatePDF
        } = req.body;

        // Validar que alumnos no creen salas privadas
        if (req.user.rol === 'Alumno' && tipo_sala === 'Privada') {
            return res.status(403).json({ error: 'Los alumnos no pueden crear salas privadas' });
        }

        const [result] = await db.query(
            `INSERT INTO salas_debate (titulo, descripcion, tipo_sala, reglas, creador_id, estado, duracion_turno, guardar_historial, generar_pdf) 
             VALUES (?, ?, ?, ?, ?, 'Programada', ?, ?, ?)`,
            [titulo, descripcion, tipo_sala, reglas || '', req.user.id, duracion_turno || 90, saveToHistory ? 1 : 0, generatePDF ? 1 : 0]
        );

        // Agregar al creador como participante y moderador
        await db.query(
            `INSERT INTO participantes_sala (sala_id, usuario_id, rol_en_sala) 
             VALUES (?, ?, 'Moderador')`,
            [result.insertId, req.user.id]
        );

        // Obtener la sala recién creada
        const [newSala] = await db.query(
            `SELECT 
                s.id,
                s.titulo as name,
                s.descripcion as description,
                s.tipo_sala as type,
                s.estado as status,
                s.creador_id,
                s.creada_en,
                1 as participants
            FROM salas_debate s
            WHERE s.id = ?`,
            [result.insertId]
        );

        const sala = {
            id: `room-${newSala[0].id}`,
            name: newSala[0].name,
            description: newSala[0].description,
            type: newSala[0].type === 'General' ? 'general' : 'private',
            participants: newSala[0].participants,
            status: 'scheduled',
            createdAt: newSala[0].creada_en,
            creador_id: newSala[0].creador_id
        };

        res.json(sala);
    } catch (error) {
        console.error('Error al crear sala:', error);
        res.status(500).json({ error: 'Error al crear la sala' });
    }
});

// Unirse a una sala
app.post('/api/salas/:id/join', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const salaId = req.params.id.replace('room-', '');

    try {
        // Verificar si ya es participante
        const [existing] = await db.query(
            'SELECT * FROM participantes_sala WHERE sala_id = ? AND usuario_id = ?',
            [salaId, req.user.id]
        );

        if (existing.length === 0) {
            await db.query(
                'INSERT INTO participantes_sala (sala_id, usuario_id, rol_en_sala) VALUES (?, ?, ?)',
                [salaId, req.user.id, 'Participante']
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al unirse a la sala:', error);
        res.status(500).json({ error: 'Error al unirse a la sala' });
    }
});

// Finalizar debate
app.post('/api/salas/:id/finalizar', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const salaId = req.params.id.replace('room-', '');
    const { acuerdo, duracion, chatHistory } = req.body;

    try {
        // Verificar propiedad
        const [sala] = await db.query('SELECT * FROM salas_debate WHERE id = ?', [salaId]);

        if (sala.length === 0) return res.status(404).json({ error: 'Sala no encontrada' });
        if (sala[0].creador_id !== req.user.id) return res.status(403).json({ error: 'No autorizado' });

        // Actualizar sala
        await db.query(
            `UPDATE salas_debate 
             SET estado = 'Finalizada', acuerdo_alcanzado = ?, duracion_real = ? 
             WHERE id = ?`,
            [acuerdo, duracion, salaId]
        );

        // Generar resumen si corresponde
        if (sala[0].generar_pdf === 1) {
            await db.query(
                `INSERT INTO resumenes (sala_id, texto_resumen, chat_export, generado_por) 
                 VALUES (?, ?, ?, ?)`,
                [salaId, `Resumen generado automáticamente para el debate: ${sala[0].titulo}. Acuerdo: ${acuerdo}`, JSON.stringify(chatHistory || []), req.user.id]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al finalizar sala:', error);
        res.status(500).json({ error: 'Error al finalizar la sala' });
    }
});

// Descargar PDF del resumen
app.get('/api/resumenes/:salaId/pdf', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const salaId = req.params.salaId;

    try {
        // Obtener datos del resumen, sala y participantes
        const [resumen] = await db.query(
            `SELECT r.*, s.titulo, s.duracion_real, s.creada_en, s.acuerdo_alcanzado 
             FROM resumenes r 
             JOIN salas_debate s ON r.sala_id = s.id 
             WHERE s.id = ?`,
            [salaId]
        );

        if (resumen.length === 0) {
            return res.status(404).json({ error: 'Resumen no encontrado' });
        }

        const data = resumen[0];
        const chatHistory = data.chat_export ? JSON.parse(data.chat_export) : [];

        // Obtener participantes
        const [participantes] = await db.query(
            `SELECT u.nombre, p.rol_en_sala 
             FROM participantes_sala p 
             JOIN users u ON p.usuario_id = u.id 
             WHERE p.sala_id = ?`,
            [salaId]
        );

        // Crear PDF
        const doc = new PDFDocument();

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Resumen_Debate_${salaId}.pdf`);

        doc.pipe(res);

        // Título
        doc.fontSize(20).text(`Resumen de Debate: ${data.titulo}`, { align: 'center' });
        doc.moveDown();

        // Información General
        doc.fontSize(12).text(`Fecha: ${new Date(data.creada_en).toLocaleDateString()}`);
        doc.text(`Duración: ${Math.floor(data.duracion_real / 60)} min ${data.duracion_real % 60} s`);
        doc.moveDown();

        // Acuerdo
        doc.fontSize(14).text('Acuerdo / Conclusiones:', { underline: true });
        doc.fontSize(12).text(data.acuerdo_alcanzado || 'No registrado');
        doc.moveDown();

        // Participantes
        doc.fontSize(14).text('Participantes:', { underline: true });
        doc.fontSize(12);
        participantes.forEach(p => {
            doc.text(`- ${p.nombre} (${p.rol_en_sala})`);
        });
        doc.moveDown();

        // Historial de Chat
        if (chatHistory.length > 0) {
            doc.addPage();
            doc.fontSize(16).text('Historial del Chat', { align: 'center' });
            doc.moveDown();

            chatHistory.forEach(msg => {
                doc.fontSize(10).fillColor('grey').text(`${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.user}:`, { continued: true });
                doc.fillColor('black').text(` ${msg.text}`);
            });
        }

        doc.end();

    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({ error: 'Error al generar PDF' });
    }
});

// Obtener historial del usuario
app.get('/api/historial', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const [rows] = await db.query(
            `SELECT 
                s.id,
                s.titulo,
                s.descripcion,
                s.tipo_sala,
                s.creada_en,
                s.duracion_real,
                s.acuerdo_alcanzado,
                s.generar_pdf,
                COUNT(p2.id) as total_participantes,
                MAX(r.id) as resumen_id
            FROM participantes_sala p
            JOIN salas_debate s ON p.sala_id = s.id
            LEFT JOIN participantes_sala p2 ON s.id = p2.sala_id
            LEFT JOIN resumenes r ON s.id = r.sala_id
            WHERE p.usuario_id = ? 
            AND s.estado = 'Finalizada'
            AND s.guardar_historial = 1
            GROUP BY s.id
            ORDER BY s.creada_en DESC`,
            [req.user.id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

// Actualizar sala (PUT)
app.put('/api/salas/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const salaId = req.params.id.replace('room-', '');
    const { titulo, descripcion, reglas, estado } = req.body;

    try {
        // Verificar propiedad de la sala
        const [sala] = await db.query('SELECT creador_id FROM salas_debate WHERE id = ?', [salaId]);

        if (sala.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }

        if (sala[0].creador_id !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para editar esta sala' });
        }

        await db.query(
            `UPDATE salas_debate 
             SET titulo = ?, descripcion = ?, reglas = ?, estado = ?
             WHERE id = ?`,
            [titulo, descripcion, reglas, estado, salaId]
        );

        res.json({ success: true, message: 'Sala actualizada' });
    } catch (error) {
        console.error('Error al actualizar sala:', error);
        res.status(500).json({ error: 'Error al actualizar la sala' });
    }
});

// Eliminar sala (DELETE)
app.delete('/api/salas/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const salaId = req.params.id.replace('room-', '');

    try {
        // Verificar propiedad de la sala
        const [sala] = await db.query('SELECT creador_id FROM salas_debate WHERE id = ?', [salaId]);

        if (sala.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }

        if (sala[0].creador_id !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta sala' });
        }

        // Eliminar participantes primero (por clave foránea)
        await db.query('DELETE FROM participantes_sala WHERE sala_id = ?', [salaId]);

        // Eliminar sala
        await db.query('DELETE FROM salas_debate WHERE id = ?', [salaId]);

        res.json({ success: true, message: 'Sala eliminada' });
    } catch (error) {
        console.error('Error al eliminar sala:', error);
        res.status(500).json({ error: 'Error al eliminar la sala' });
    }
});

// Obtener participantes de una sala específica
app.get('/api/salas/:id/participantes', async (req, res) => {
    try {
        const salaId = req.params.id.replace('room-', '');

        const [rows] = await db.query(
            `SELECT 
                u.id,
                u.nombre,
                u.email,
                u.foto_perfil,
                p.rol_en_sala,
                p.se_unio_en
            FROM participantes_sala p
            JOIN users u ON p.usuario_id = u.id
            WHERE p.sala_id = ?
            ORDER BY p.se_unio_en ASC`,
            [salaId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener participantes:', error);
        res.status(500).json({ error: 'Error al obtener participantes' });
    }
});

// Ruta de Logout
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.clearCookie('connect.sid'); // Limpia la cookie
        res.redirect(process.env.LOGIN_URL); // Vuelve al login
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

