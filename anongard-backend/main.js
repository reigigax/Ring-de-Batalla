require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const app = express();


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function(accessToken, refreshToken, profile, done) {
        console.log("Perfil recibido de Google:", profile.displayName);
        return done(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/', (req, res) => {
    res.send('<h1>Inicio</h1><a href="/auth/google">Iniciar sesión con Google</a>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de Callback (donde Google nos devuelve al usuario)
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    // Autenticación exitosa, redirigir al perfil.
    res.redirect('http://localhost:5173/home');
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Ruta Protegida (Perfil)
app.get('/perfil', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`
        <h1>Bienvenido ${req.user.displayName}</h1>
        <p>Email: ${req.user.emails[0].value}</p>
        <img src="${req.user.photos[0].value}" />
        <br><br>
        <a href="/logout">Cerrar sesión</a>
    `);
});

// Ruta de Logout
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});