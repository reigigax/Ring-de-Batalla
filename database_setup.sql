-- =====================================================
-- Ring de Batalla - AnonGard Database Setup Script
-- =====================================================
-- Versión: 1.0.0
-- Descripción: Script completo para crear la base de datos
-- Autor: Equipo AnonGard
-- Fecha: 2025-12-05
-- =====================================================
-- =====================================================
-- CONFIGURACIÓN INICIAL
-- =====================================================
-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS ring_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Usar la base de datos
USE ring_auth;
-- =====================================================
-- ELIMINAR TABLAS EXISTENTES (en orden correcto)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS codigos_verificacion;
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS permisos_resumen;
DROP TABLE IF EXISTS resumenes;
DROP TABLE IF EXISTS participantes_sala;
DROP TABLE IF EXISTS invitaciones;
DROP TABLE IF EXISTS salas_debate;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
-- =====================================================
-- 1. TABLA: USERS
-- =====================================================
-- Almacena información de usuarios del sistema
-- Roles: Alumno, Profesor, Funcionario
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    foto_perfil VARCHAR(500) NULL,
    fecha_nacimiento DATE NULL,
    comuna VARCHAR(100) NULL,
    rol ENUM('Alumno', 'Profesor', 'Funcionario') NULL,
    curso VARCHAR(100) NULL,
    numero_contacto VARCHAR(20) NULL,
    nombre_apoderado VARCHAR(100) NULL,
    numero_contacto_apoderado VARCHAR(20) NULL,
    registro_completo TINYINT(1) NOT NULL DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_registro_completo (registro_completo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 2. TABLA: SALAS_DEBATE
-- =====================================================
-- Almacena las salas de debate creadas
-- Tipos: General (abierta), Privada (por invitación)
-- Estados: Programada, EnCurso, Finalizada
-- =====================================================
CREATE TABLE salas_debate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    reglas TEXT,
    tipo_sala ENUM('General', 'Privada') NOT NULL,
    creador_id INT NOT NULL,
    estado ENUM('Programada', 'EnCurso', 'Finalizada') DEFAULT 'Programada',
    duracion_turno INT NOT NULL DEFAULT 90,
    guardar_historial TINYINT(1) NOT NULL DEFAULT 1,
    generar_pdf TINYINT(1) NOT NULL DEFAULT 0,
    acuerdo_alcanzado TEXT,
    duracion_real INT,
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creador_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creador (creador_id),
    INDEX idx_tipo_sala (tipo_sala),
    INDEX idx_estado (estado),
    INDEX idx_creada_en (creada_en)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 3. TABLA: PARTICIPANTES_SALA
-- =====================================================
-- Relación entre usuarios y salas de debate
-- Roles en sala: Participante, Moderador
-- =====================================================
CREATE TABLE participantes_sala (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    usuario_id INT NOT NULL,
    rol_en_sala ENUM('Participante', 'Moderador') NOT NULL DEFAULT 'Participante',
    se_unio_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sala_usuario (sala_id, usuario_id),
    FOREIGN KEY (sala_id) REFERENCES salas_debate(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sala (sala_id),
    INDEX idx_usuario (usuario_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 4. TABLA: INVITACIONES
-- =====================================================
-- Sistema de invitaciones para salas privadas
-- Estados: pendiente, aceptada, rechazada
-- =====================================================
CREATE TABLE invitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    usuario_id INT NOT NULL,
    invitado_por INT NOT NULL,
    estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respondida_en TIMESTAMP NULL,
    FOREIGN KEY (sala_id) REFERENCES salas_debate(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invitado_por) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sala (sala_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 5. TABLA: RESUMENES
-- =====================================================
-- Almacena resúmenes de debates finalizados
-- Incluye exportación de chat y compromisos
-- =====================================================
CREATE TABLE resumenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    texto_resumen TEXT,
    chat_export LONGTEXT,
    compromisos_text LONGTEXT,
    generado_por INT NULL,
    generado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sala_id) REFERENCES salas_debate(id) ON DELETE CASCADE,
    FOREIGN KEY (generado_por) REFERENCES users(id) ON DELETE
    SET NULL,
        INDEX idx_sala (sala_id),
        INDEX idx_generado_en (generado_en)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 6. TABLA: PERMISOS_RESUMEN
-- =====================================================
-- Control de acceso a resúmenes por usuario
-- Permisos: ver, descargar
-- =====================================================
CREATE TABLE permisos_resumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resumen_id INT NOT NULL,
    usuario_id INT NOT NULL,
    puede_ver TINYINT(1) NOT NULL DEFAULT 1,
    puede_descargar TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE KEY uq_resumen_usuario (resumen_id, usuario_id),
    FOREIGN KEY (resumen_id) REFERENCES resumenes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_resumen (resumen_id),
    INDEX idx_usuario (usuario_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 7. TABLA: NOTIFICACIONES
-- =====================================================
-- Sistema de notificaciones para usuarios
-- Tipos: invitacion, debate_iniciado, debate_finalizado, etc.
-- =====================================================
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leida TINYINT(1) NOT NULL DEFAULT 0,
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_leida (leida),
    INDEX idx_creada_en (creada_en)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- 8. TABLA: CODIGOS_VERIFICACION
-- =====================================================
-- Códigos de verificación para recuperación de cuenta
-- Tipos: cambio_password, recuperacion, verificacion
-- =====================================================
CREATE TABLE codigos_verificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    tipo ENUM(
        'cambio_password',
        'recuperacion',
        'verificacion'
    ) NOT NULL,
    expiracion DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_codigo (codigo),
    INDEX idx_usado (usado)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomentar para insertar datos de prueba
/*
 -- Usuario de prueba: Profesor
 INSERT INTO users (nombre, email, foto_perfil, rol, registro_completo) VALUES
 ('Profesor Demo', 'profesor@demo.com', 'https://ui-avatars.com/api/?name=Profesor+Demo&background=3A7CA5&color=fff', 'Profesor', 1);
 
 -- Usuario de prueba: Alumno
 INSERT INTO users (nombre, email, foto_perfil, rol, curso, registro_completo) VALUES
 ('Alumno Demo', 'alumno@demo.com', 'https://ui-avatars.com/api/?name=Alumno+Demo&background=3A7CA5&color=fff', 'Alumno', '4to Medio A', 1);
 
 -- Sala de ejemplo: General
 INSERT INTO salas_debate (titulo, descripcion, reglas, tipo_sala, creador_id, estado, guardar_historial, generar_pdf) VALUES
 ('Debate sobre Evaluaciones', 'Discusión sobre el sistema de evaluación actual', 'Respetar turnos, argumentar con fundamentos, mantener respeto', 'General', 1, 'Programada', 1, 1);
 
 -- Sala de ejemplo: Privada
 INSERT INTO salas_debate (titulo, descripcion, reglas, tipo_sala, creador_id, estado, guardar_historial, generar_pdf) VALUES
 ('Mediación de Conflicto', 'Sesión privada de mediación', 'Confidencialidad total, escucha activa, búsqueda de soluciones', 'Privada', 1, 'Programada', 1, 0);
 */
-- =====================================================
-- VISTAS ÚTILES
-- =====================================================
-- Vista: Salas con información del creador
CREATE OR REPLACE VIEW v_salas_completas AS
SELECT s.id,
    s.titulo,
    s.descripcion,
    s.tipo_sala,
    s.estado,
    s.creada_en,
    u.nombre AS creador_nombre,
    u.email AS creador_email,
    COUNT(DISTINCT p.usuario_id) AS total_participantes
FROM salas_debate s
    LEFT JOIN users u ON s.creador_id = u.id
    LEFT JOIN participantes_sala p ON s.id = p.sala_id
GROUP BY s.id,
    s.titulo,
    s.descripcion,
    s.tipo_sala,
    s.estado,
    s.creada_en,
    u.nombre,
    u.email;
-- Vista: Historial de debates por usuario
CREATE OR REPLACE VIEW v_historial_usuario AS
SELECT u.id AS usuario_id,
    u.nombre AS usuario_nombre,
    s.id AS sala_id,
    s.titulo AS sala_titulo,
    s.tipo_sala,
    s.duracion_real,
    s.acuerdo_alcanzado,
    s.creada_en,
    p.se_unio_en
FROM users u
    JOIN participantes_sala p ON u.id = p.usuario_id
    JOIN salas_debate s ON p.sala_id = s.id
WHERE s.estado = 'Finalizada'
ORDER BY s.creada_en DESC;
-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================
DELIMITER // -- Procedimiento: Finalizar debate
CREATE PROCEDURE sp_finalizar_debate(
    IN p_sala_id INT,
    IN p_duracion_real INT,
    IN p_acuerdo_alcanzado TEXT
) BEGIN
UPDATE salas_debate
SET estado = 'Finalizada',
    duracion_real = p_duracion_real,
    acuerdo_alcanzado = p_acuerdo_alcanzado
WHERE id = p_sala_id;
END // -- Procedimiento: Obtener estadísticas de usuario
CREATE PROCEDURE sp_estadisticas_usuario(IN p_usuario_id INT) BEGIN
SELECT COUNT(DISTINCT p.sala_id) AS total_debates,
    SUM(s.duracion_real) AS tiempo_total,
    COUNT(
        DISTINCT CASE
            WHEN s.creador_id = p_usuario_id THEN s.id
        END
    ) AS debates_creados,
    COUNT(DISTINCT p2.usuario_id) AS participantes_totales
FROM participantes_sala p
    LEFT JOIN salas_debate s ON p.sala_id = s.id
    LEFT JOIN participantes_sala p2 ON s.id = p2.sala_id
WHERE p.usuario_id = p_usuario_id
    AND s.estado = 'Finalizada';
END // DELIMITER;
-- =====================================================
-- TRIGGERS
-- =====================================================
DELIMITER // -- Trigger: Crear notificación al invitar a sala
CREATE TRIGGER tr_notificar_invitacion
AFTER
INSERT ON invitaciones FOR EACH ROW BEGIN
DECLARE sala_titulo VARCHAR(200);
DECLARE invitador_nombre VARCHAR(100);
SELECT titulo INTO sala_titulo
FROM salas_debate
WHERE id = NEW.sala_id;
SELECT nombre INTO invitador_nombre
FROM users
WHERE id = NEW.invitado_por;
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
VALUES (
        NEW.usuario_id,
        'invitacion',
        'Nueva invitación a sala',
        CONCAT(
            invitador_nombre,
            ' te ha invitado a la sala "',
            sala_titulo,
            '"'
        )
    );
END // DELIMITER;
-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================
-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_salas_tipo_estado ON salas_debate(tipo_sala, estado);
CREATE INDEX idx_participantes_sala_usuario ON participantes_sala(sala_id, usuario_id);
CREATE INDEX idx_notificaciones_usuario_leida ON notificaciones(usuario_id, leida);
-- =====================================================
-- PERMISOS Y SEGURIDAD
-- =====================================================
-- Crear usuario de aplicación (opcional)
-- DESCOMENTAR Y MODIFICAR SEGÚN NECESIDAD
/*
 CREATE USER IF NOT EXISTS 'anongard_app'@'localhost' IDENTIFIED BY 'password_seguro_aqui';
 GRANT SELECT, INSERT, UPDATE, DELETE ON ring_auth.* TO 'anongard_app'@'localhost';
 FLUSH PRIVILEGES;
 */
-- =====================================================
-- VERIFICACIÓN DE INSTALACIÓN
-- =====================================================
SELECT 'Base de datos creada exitosamente' AS mensaje;
SELECT TABLE_NAME,
    TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'ring_auth'
ORDER BY TABLE_NAME;
-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- Para ejecutar este script:
-- mysql -u root -p < database_setup.sql
-- 
-- O desde MySQL:
-- source /ruta/completa/database_setup.sql
-- =====================================================