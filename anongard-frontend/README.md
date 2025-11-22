# Ring de Batalla - AnonGard Frontend

Este proyecto es la interfaz de usuario para la plataforma "Ring de Batalla", un espacio seguro para debates educativos. Está construido con React y Vite, siguiendo una arquitectura modular y escalable.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura de carpetas organizada por funcionalidad y tipo de recurso, diseñada para facilitar el mantenimiento y la escalabilidad.

### Estructura de Directorios

```text
src/
├── assets/          # Recursos estáticos (imágenes, iconos, fuentes)
├── components/      # Componentes reutilizables de la UI
│   ├── common/      # Componentes genéricos (Botones, Modales, Spinners)
│   ├── layout/      # Componentes de estructura (Navbar, Footer, Sidebar)
│   └── features/    # Componentes específicos de funcionalidades complejas
├── context/         # Estados globales (AuthContext, ThemeContext)
├── hooks/           # Custom Hooks (useAuth, useFetch, useForm)
├── pages/           # Vistas principales de la aplicación
│   ├── Dashboard/   # Página principal del usuario
│   ├── Home/        # Página de inicio
│   ├── Login/       # Página de autenticación
│   ├── Profile/     # Perfil de usuario
│   └── ...          # Cada página tiene su propio directorio con .jsx y .css co-ubicados
├── routes/          # Configuración de rutas y componentes de protección (ProtectedRoute)
├── services/        # Lógica de comunicación con APIs externas
├── styles/          # Estilos globales, variables CSS y reset
└── utils/           # Funciones auxiliares y validadores
```

### Descripción de Carpetas

*   **`src/pages/`**: Contiene las vistas principales de la aplicación. Cada página es un directorio que agrupa su lógica (`.jsx`) y sus estilos específicos (`.css`). Esto mantiene el código relacionado junto.
*   **`src/components/`**:
    *   **`common/`**: Componentes "tontos" o puros que se usan en toda la app (ej: `LoadingSpinner`, `ConfirmModal`). No dependen de lógica de negocio específica.
    *   **`layout/`**: Componentes que definen la estructura visual de la página (ej: `Navbar`, `MainLayout`).
    *   **`features/`**: Componentes más complejos que contienen lógica de negocio específica de una funcionalidad (ej: `CreateRoomModal`).
*   **`src/context/`**: Manejo del estado global de la aplicación utilizando React Context API. Aquí vive la lógica de autenticación (`AuthContext`) y preferencias de tema.
*   **`src/hooks/`**: Hooks personalizados para encapsular lógica reutilizable, como manejo de formularios (`useForm`), peticiones HTTP (`useFetch`) o lógica de autenticación OIDC (`useOIDCAuth`).
*   **`src/routes/`**: Define la protección de rutas. `ProtectedRoute` asegura que solo usuarios autenticados accedan a ciertas vistas.
*   **`src/services/`**: Capa de abstracción para llamadas a APIs. Aquí se definen las funciones que interactúan con el backend (ej: `authService`).
*   **`src/utils/`**: Funciones de utilidad puras, como formateadores de fecha (`formatDate`) o validadores de formularios (`validators`).
*   **`src/styles/`**: Archivos CSS globales.
    *   `variables.css`: Define colores, espaciados y tipografías como variables CSS.
    *   `reset.css`: Normaliza los estilos entre navegadores.
    *   `index.css`: Estilos base globales.

## 🚀 Comenzando

### Prerrequisitos

*   Node.js (versión 16 o superior)
*   npm o yarn

### Instalación

1.  Clona el repositorio.
2.  Instala las dependencias:

```bash
npm install
```

### Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.
