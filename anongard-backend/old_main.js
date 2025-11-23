require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-openidconnect');


const app = express();
const port = 3000;


// CONFIGURACION DE SESION
app.use(session({
    secret: process.env.APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


// INICIALIZACION DE PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// CONFIGURACION DE ESTRATEGIA OIDC
passport.use('oidc', new Strategy({
    issuer: `${process.env.OIDC_ISSUER_URL}`,
    authorizationURL: `${process.env.OIDC_ISSUER_URL}/protocol/openid-connect/auth`,
    tokenURL: `${process.env.OIDC_ISSUER_URL}/protocol/openid-connect/token`,
    userInfoURL: `${process.env.OIDC_ISSUER_URL}/protocol/openid-connect/userinfo`,
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASE_URL}/auth/callback`,
    scope: 'openid profile email'
},
(issuer, profile, context, idToken, accessToken, refreshToken, state, cb) => {
    profile.id_token = idToken; 
    return cb(null, profile);
}));


// SERIALIZACION DEL USUARIO
passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
});


// RUTAS
app.get('/login', passport.authenticate('oidc'));
app.get('/auth/callback',
    passport.authenticate('oidc', {
        failureRedirect: '/login-fallido',
        failureMessage: true
    }),
    (req, res) => {
        res.redirect('/perfil');
    }
);


// MODIFICADO: Enviamos el id_token_hint
app.get('/logout', (req, res, next) => {
    const idToken = req.user ? req.user.id_token : null;
    req.logout((err) => {
        if(err) { return next(err); }
        req.session.destroy();
        let logoutUrl = `${process.env.OIDC_ISSUER_URL}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.APP_BASE_URL)}`;
        if (idToken) {
            logoutUrl += `&id_token_hint=${idToken}`;
        }
        res.redirect(logoutUrl);
    });
});

// Middleware para Proteger Rutas
function estaAutenticado(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}


app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hola, ${req.user.displayName}! <a href="/perfil">Ver Perfil</a> <a href="/logout">Cerrar Sesión</a>`);
    } else {
        res.send('Estás desconectado. <a href="/login">Iniciar Sesión</a>');
    }
});

app.get('/login-fallido', (req, res) => {
    res.send('El inicio de sesión falló.');
});

// Ruta protegida
app.get('/perfil', estaAutenticado, (req, res) => {
    res.json(req.user);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en ${process.env.APP_BASE_URL}`);
});