# 🎯 Ring de Batalla - AnonGard

> Plataforma de debates anónimos para instituciones educativas

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API](#-api)
- [Contribución](#-contribución)

---

## 📖 Descripción

**Ring de Batalla - AnonGard** es una plataforma web diseñada para facilitar debates anónimos y constructivos en entornos educativos. Permite a profesores y estudiantes crear salas de debate, participar en discusiones en tiempo real, y generar resúmenes automáticos de las conversaciones.

### Objetivos

- ✅ Fomentar la participación estudiantil sin temor al juicio
- ✅ Facilitar la mediación de conflictos de forma anónima
- ✅ Generar espacios de debate constructivo
- ✅ Proporcionar herramientas de análisis y seguimiento

---

## ✨ Características

### 🎭 Anonimato
- Debates completamente anónimos
- Protección de identidad de participantes
- Ambiente seguro para expresar opiniones

### 🏛️ Tipos de Salas
- **Salas Generales**: Acceso abierto para todos los miembros
- **Salas Privadas**: Solo por invitación (profesores)

### 💬 Chat en Tiempo Real
- Mensajería instantánea con Socket.IO
- Indicadores de estado (en línea, ocupado)
- Notificaciones de nuevos mensajes

### 📊 Historial y Resúmenes
- Guardado automático de debates
- Exportación a PDF
- Estadísticas de participación
- Resúmenes de acuerdos alcanzados

### 👥 Gestión de Usuarios
- Autenticación con Google OAuth 2.0
- Roles: Profesor, Alumno, Funcionario
- Perfiles personalizados
- Sistema de contactos

### 🔔 Notificaciones
- Invitaciones a salas privadas
- Alertas en tiempo real
- Badge de mensajes no leídos

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Port: 5173    │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ MySQL
         │
┌────────▼────────┐
│   Database      │
│   (MySQL)       │
│   Port: 3306    │
└─────────────────┘
```

### Componentes Principales

**Frontend (React + Vite)**
- Single Page Application (SPA)
- React Router para navegación
- Context API para estado global
- Socket.IO Client para tiempo real

**Backend (Node.js + Express)**
- API RESTful
- Autenticación OAuth 2.0
- WebSockets con Socket.IO
- Middleware de sesiones

**Base de Datos (MySQL)**
- Almacenamiento relacional
- Tablas: usuarios, salas, participantes, mensajes, historial

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.0 | Framework UI |
| React Router | 7.0.0 | Navegación |
| Socket.IO Client | 4.8.1 | WebSockets |
| Vite | 7.2.4 | Build tool |
| PropTypes | 15.8.1 | Validación |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime |
| Express | 4.x | Framework web |
| Socket.IO | 4.x | WebSockets |
| MySQL2 | 3.x | Driver MySQL |
| Passport | 0.7.x | Autenticación |
| Express Session | 1.x | Sesiones |

### Base de Datos
- **MySQL 8.0+**
- Motor InnoDB
- Charset UTF8MB4

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- MySQL 8.0+
- Git

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Ring-de-Batalla.git
cd Ring-de-Batalla
```

### Paso 2: Instalar Dependencias

```bash
# Dependencias raíz
npm install

# Frontend
cd anongard-frontend
npm install

# Backend
cd ../anongard-backend
npm install
```

### Paso 3: Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p < anongard-database/schema.sql

# Ejecutar migraciones
node migrate_db.js
```

### Paso 4: Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ring_db

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Sesión
SESSION_SECRET=tu_secret_key_muy_segura

# Servidor
PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## ⚙️ Configuración

### Google OAuth 2.0

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URLs autorizadas:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/google/callback`

### Base de Datos

Estructura principal:

```sql
usuarios (id, nombre, email, rol, foto_perfil, creado_en)
salas (id, titulo, descripcion, tipo_sala, creador_id, creada_en)
participantes (id, sala_id, usuario_id, unido_en)
mensajes (id, sala_id, usuario_id, contenido, enviado_en)
historial_debates (id, sala_id, duracion_real, acuerdo_alcanzado)
```

---

## 🚀 Uso

### Iniciar el Proyecto

```bash
# Terminal 1: Backend
cd anongard-backend
npm run dev

# Terminal 2: Frontend
cd anongard-frontend
npm run dev
```

Acceder a: `http://localhost:5173`

### Flujo de Usuario

1. **Login**: Autenticación con Google
2. **Completar Registro**: Seleccionar rol (Profesor/Alumno/Funcionario)
3. **Dashboard**: Ver salas disponibles
4. **Crear Sala**: (Profesores) Crear salas generales o privadas
5. **Unirse**: Participar en debates
6. **Chat**: Comunicación en tiempo real
7. **Finalizar**: Guardar resumen y generar PDF

---

## 📁 Estructura del Proyecto

```
Ring-de-Batalla/
├── anongard-frontend/          # Aplicación React
│   ├── src/
│   │   ├── assets/            # Imágenes, logos
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── common/       # Button, Modal, Toggle
│   │   │   ├── features/     # CreateRoomModal, StudentSelector
│   │   │   └── layout/       # Navbar, Footer, Sidebar
│   │   ├── context/          # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useOIDCAuth.js
│   │   │   └── useForm.js
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Dashboard/
│   │   │   ├── Ring/
│   │   │   ├── Profile/
│   │   │   └── DebateHistory/
│   │   ├── services/         # API services
│   │   ├── styles/           # CSS globales
│   │   └── App.jsx
│   └── package.json
│
├── anongard-backend/           # Servidor Express
│   ├── config/               # Configuración
│   ├── controllers/          # Lógica de negocio
│   ├── middleware/           # Middleware personalizado
│   ├── routes/               # Rutas API
│   ├── socket/               # Socket.IO handlers
│   └── server.js
│
├── anongard-database/          # Scripts SQL
│   ├── schema.sql
│   └── migrations/
│
├── .env                       # Variables de entorno
└── README.md                  # Este archivo
```

### Componentes Clave

#### Frontend

**Páginas:**
- `Dashboard.jsx` - Panel principal con salas
- `Ring.jsx` - Sala de debate en tiempo real
- `Profile.jsx` - Perfil de usuario
- `DebateHistory.jsx` - Historial de debates
- `Home.jsx` - Página de inicio

**Componentes:**
- `RoomCard.jsx` - Tarjeta de sala moderna
- `CreateRoomModal.jsx` - Modal de creación
- `Button.jsx` - Botón reutilizable
- `Toggle.jsx` - Switch personalizado

**Contextos:**
- `AuthContext` - Gestión de autenticación
- `SocketContext` - Conexión WebSocket

---

## 🔌 API

### Endpoints Principales

#### Autenticación
```
GET  /auth/google              # Iniciar OAuth
GET  /auth/google/callback     # Callback OAuth
POST /logout                   # Cerrar sesión
GET  /api/usuario-actual       # Usuario autenticado
```

#### Salas
```
GET    /api/salas              # Listar salas
POST   /api/salas              # Crear sala
GET    /api/salas/:id          # Detalle de sala
DELETE /api/salas/:id          # Eliminar sala
POST   /api/salas/:id/unirse   # Unirse a sala
```

#### Debates
```
GET  /api/salas/:id/participantes  # Participantes
POST /api/salas/:id/finalizar      # Finalizar debate
GET  /api/historial                # Historial usuario
GET  /api/resumenes/:id            # Resumen debate
```

#### Mensajes
```
Socket: 'join_room'            # Unirse a sala
Socket: 'chat_message'         # Enviar mensaje
Socket: 'start_debate'         # Iniciar debate
Socket: 'end_debate'           # Finalizar debate
```

---

## 🎨 Diseño

### Paleta de Colores

```css
/* Principales */
--primary-blue: #2196F3
--primary-purple: #9C27B0
--green-active: #10b981

/* Grises */
--gray-50: #f9fafb
--gray-800: #1f2937

/* Gradientes */
--header-blue: linear-gradient(135deg, #E3F2FD, #BBDEFB)
--header-purple: linear-gradient(135deg, #F3E5F5, #E1BEE7)
```

### Tipografía

- **Principal**: System UI, -apple-system, sans-serif
- **Tamaños**: 12px - 32px
- **Pesos**: 400 (normal), 600 (semibold), 700 (bold)

---

## 🧪 Testing

```bash
# Frontend
cd anongard-frontend
npm run lint

# Backend
cd anongard-backend
npm test
```

---

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev      # Servidor desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # Linter
```

### Backend
```bash
npm run dev      # Servidor desarrollo (nodemon)
npm start        # Servidor producción
npm run migrate  # Ejecutar migraciones
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones

- **Commits**: Conventional Commits
- **Código**: ESLint + Prettier
- **Comentarios**: Solo JSDoc español profesional
- **Ramas**: `feature/`, `fix/`, `docs/`

---

## 📄 Licencia

Este proyecto es privado y está bajo licencia propietaria.

---

## 👥 Autores

- **Equipo AnonGard** - Desarrollo inicial

---

## 📞 Soporte

Para soporte y consultas:
- Email: soporte@anongard.edu
- Issues: GitHub Issues

---

## 🗺️ Roadmap

### v1.1 (Próximo)
- [ ] Moderación automática con IA
- [ ] Análisis de sentimientos
- [ ] Gamificación y logros
- [ ] App móvil (React Native)

### v1.2 (Futuro)
- [ ] Integración con Microsoft Teams
- [ ] Soporte multiidioma
- [ ] Temas personalizables
- [ ] Analytics avanzado

---

## 📊 Estado del Proyecto

- ✅ Autenticación OAuth
- ✅ Salas de debate
- ✅ Chat en tiempo real
- ✅ Historial y resúmenes
- ✅ Sistema de invitaciones
- ✅ Generación de PDF
- 🔄 Moderación con IA (en desarrollo)
- 🔄 App móvil (planificado)

---

**Hecho con ❤️ para la educación**
