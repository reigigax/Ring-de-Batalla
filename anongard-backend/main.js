require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SamlStrategy = require('passport-saml').Strategy;
const db = require('./database_connection');

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
            createdAt: sala.creada_en
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
            duracion_turno
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO salas_debate (titulo, descripcion, tipo_sala, reglas, creador_id, estado, duracion_turno) 
             VALUES (?, ?, ?, ?, ?, 'Programada', ?)`,
            [titulo, descripcion, tipo_sala, reglas || '', req.user.id, duracion_turno || 90]
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
            createdAt: newSala[0].creada_en
        };

        res.json(sala);
    } catch (error) {
        console.error('Error al crear sala:', error);
        res.status(500).json({ error: 'Error al crear la sala' });
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

