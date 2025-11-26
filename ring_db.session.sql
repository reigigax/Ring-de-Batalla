USE ring_auth;

-- ========================================
-- 1. USERS
-- ========================================
CREATE TABLE users (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  nombre                 VARCHAR(100) NOT NULL,
  email                  VARCHAR(150) NOT NULL UNIQUE,
  password_hash          VARCHAR(255) NOT NULL,
  rol                    ENUM('Alumno','Profesor','Funcionario') NOT NULL,
  debe_cambiar_password  TINYINT(1) NOT NULL DEFAULT 1,
  creado_en              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 2. SALAS DE DEBATE
-- ========================================
CREATE TABLE salas_debate (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(200) NOT NULL,
  descripcion     TEXT,
  reglas          TEXT,
  tipo_sala       ENUM('General','Privada') NOT NULL,
  creador_id      INT NOT NULL,
  estado          ENUM('Programada','EnCurso','Finalizada') DEFAULT 'Programada',
  duracion_turno  INT NOT NULL DEFAULT 90,
  creada_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creador_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 3. PARTICIPANTES POR SALA
-- ========================================
CREATE TABLE participantes_sala (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  sala_id        INT NOT NULL,
  usuario_id     INT NOT NULL,
  rol_en_sala    ENUM('Participante','Moderador') NOT NULL DEFAULT 'Participante',
  se_unio_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sala_usuario (sala_id, usuario_id),
  FOREIGN KEY (sala_id) REFERENCES salas_debate(id),
  FOREIGN KEY (usuario_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 4. RESÚMENES
-- ========================================
CREATE TABLE resumenes (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  sala_id          INT NOT NULL,
  texto_resumen    TEXT,
  chat_export      LONGTEXT,
  compromisos_text LONGTEXT,
  generado_por     INT NULL,
  generado_en      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sala_id) REFERENCES salas_debate(id),
  FOREIGN KEY (generado_por) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 5. PERMISOS DEL RESUMEN
-- ========================================
CREATE TABLE permisos_resumen (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  resumen_id       INT NOT NULL,
  usuario_id       INT NOT NULL,
  puede_ver        TINYINT(1) NOT NULL DEFAULT 1,
  puede_descargar  TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_resumen_usuario (resumen_id, usuario_id),
  FOREIGN KEY (resumen_id) REFERENCES resumenes(id),
  FOREIGN KEY (usuario_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 6. NOTIFICACIONES
-- ========================================
CREATE TABLE notificaciones (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo       VARCHAR(50) NOT NULL,
  titulo     VARCHAR(150) NOT NULL,
  mensaje    TEXT NOT NULL,
  leida      TINYINT(1) NOT NULL DEFAULT 0,
  creada_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================
-- 7. CÓDIGOS DE VERIFICACIÓN
-- ========================================
CREATE TABLE codigos_verificacion (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NOT NULL,
  codigo        VARCHAR(10) NOT NULL,
  tipo          ENUM('cambio_password', 'recuperacion', 'verificacion') NOT NULL,
  expiracion    DATETIME NOT NULL,
  usado         TINYINT(1) NOT NULL DEFAULT 0,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;