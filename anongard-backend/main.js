require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
    function(accessToken, refreshToken, profile, done) {
        console.log("✅ Perfil Google recibido:", profile.displayName);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// --- RUTAS ---

// 1. Iniciar Login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Callback de Google
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.LOGIN_URL }),
    function(req, res) {
        // Autenticación exitosa.
        console.log("🔄 Redirigiendo al Frontend:", process.env.HOME_URL);
        // Redirige a http://localhost:5173/home
        res.redirect(process.env.HOME_URL);
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

// Ruta de Logout
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('connect.sid'); // Limpia la cookie
        res.redirect(process.env.LOGIN_URL); // Vuelve al login
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});