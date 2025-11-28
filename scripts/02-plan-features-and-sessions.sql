-- Script para agregar sistema de límites por plan y control de sesiones
-- Version 1.0

-- 1. Crear tabla de características y límites por plan
CREATE TABLE IF NOT EXISTS `plan_features` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `plan_id` INT(11) NOT NULL,
  `feature_code` VARCHAR(50) NOT NULL COMMENT 'Código del módulo o característica',
  `feature_name` VARCHAR(100) NOT NULL COMMENT 'Nombre del módulo',
  `is_enabled` TINYINT(1) DEFAULT 1 COMMENT 'Si el módulo está habilitado',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_plan_feature` (`plan_id`, `feature_code`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_feature_code` (`feature_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Crear tabla de límites por plan
CREATE TABLE IF NOT EXISTS `plan_limits` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
	`plan_id` INT(11) NOT NULL,
	`max_staff` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de usuarios',
	`max_clients` INT(11) NULL DEFAULT '1'  COMMENT 'Máximo de clientes (NULL = ilimitado)',
	`max_patients` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de pacientes (NULL = ilimitado)',
	`max_items` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de ítems en inventario (NULL = ilimitado)',
	`max_clinics` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de clínicas (NULL = ilimitado)',
	`max_consultations` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de consultas mensuales (NULL = ilimitado)',
	`max_devices` INT(11) NULL DEFAULT '1' COMMENT 'Máximo de dispositivos simultáneos',
	`created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_plan` (`plan_id`),
  KEY `idx_plan_id` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Crear tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `device_info` TEXT DEFAULT NULL COMMENT 'Información del dispositivo/navegador',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `last_activity` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_session_token` (`session_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_token` (`session_token`),
  KEY `idx_last_activity` (`last_activity`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Modificar tabla users para agregar plan_id y session_active
ALTER TABLE `users` 
ADD COLUMN `plan_id` INT(11) DEFAULT 1 COMMENT 'ID del plan de suscripción' AFTER `role`,
ADD COLUMN `session_active` TINYINT(1) DEFAULT 0 COMMENT 'Si tiene sesión activa' AFTER `plan_id`,
ADD KEY `idx_plan_id` (`plan_id`);

-- 5. Insertar límites para Plan Básico (plan_id = 1)
INSERT INTO `plan_limits` (`plan_id`, `max_users`, `max_clinics`, `max_patients`, `max_consultations`, `max_devices`) 
VALUES (1, 1, 1, 50, 100, 1)
ON DUPLICATE KEY UPDATE 
  `max_users` = 1,
  `max_clinics` = 1,
  `max_patients` = 50,
  `max_consultations` = 100,
  `max_devices` = 1;

-- 6. Insertar características para Plan Básico
INSERT INTO `plan_features` (`plan_id`, `feature_code`, `feature_name`, `is_enabled`) VALUES
(1, 'patients', 'Gestión de Pacientes', 1),
(1, 'consultations', 'Consultas', 1),
(1, 'clients', 'Gestión de Clientes', 1),
(1, 'inventory', 'Inventario Básico', 0),
(1, 'sales', 'Punto de Venta', 0),
(1, 'accounting', 'Contabilidad', 0),
(1, 'staff', 'Gestión de Personal', 0),
(1, 'reports', 'Reportes Básicos', 1)
ON DUPLICATE KEY UPDATE 
  `feature_name` = VALUES(`feature_name`),
  `is_enabled` = VALUES(`is_enabled`);

-- 7. Insertar límites para Plan Profesional (plan_id = 2)
INSERT INTO `plan_limits` (`plan_id`, `max_users`, `max_clinics`, `max_patients`, `max_consultations`, `max_devices`) 
VALUES (2, 3, 2, 200, 500, 2)
ON DUPLICATE KEY UPDATE 
  `max_users` = 3,
  `max_clinics` = 2,
  `max_patients` = 200,
  `max_consultations` = 500,
  `max_devices` = 2;

-- 8. Insertar características para Plan Profesional
INSERT INTO `plan_features` (`plan_id`, `feature_code`, `feature_name`, `is_enabled`) VALUES
(2, 'patients', 'Gestión de Pacientes', 1),
(2, 'consultations', 'Consultas', 1),
(2, 'clients', 'Gestión de Clientes', 1),
(2, 'inventory', 'Inventario Completo', 1),
(2, 'sales', 'Punto de Venta', 1),
(2, 'accounting', 'Contabilidad', 1),
(2, 'staff', 'Gestión de Personal', 1),
(2, 'reports', 'Reportes Avanzados', 1),
(2, 'appointments', 'Agenda de Citas', 1)
ON DUPLICATE KEY UPDATE 
  `feature_name` = VALUES(`feature_name`),
  `is_enabled` = VALUES(`is_enabled`);

-- 9. Insertar límites para Plan Empresarial (plan_id = 3)
INSERT INTO `plan_limits` (`plan_id`, `max_users`, `max_clinics`, `max_patients`, `max_consultations`, `max_devices`) 
VALUES (3, NULL, NULL, NULL, NULL, 5)
ON DUPLICATE KEY UPDATE 
  `max_users` = NULL,
  `max_clinics` = NULL,
  `max_patients` = NULL,
  `max_consultations` = NULL,
  `max_devices` = 5;

-- 10. Insertar características para Plan Empresarial
INSERT INTO `plan_features` (`plan_id`, `feature_code`, `feature_name`, `is_enabled`) VALUES
(3, 'patients', 'Gestión de Pacientes', 1),
(3, 'consultations', 'Consultas', 1),
(3, 'clients', 'Gestión de Clientes', 1),
(3, 'inventory', 'Inventario Completo', 1),
(3, 'sales', 'Punto de Venta', 1),
(3, 'accounting', 'Contabilidad Completa', 1),
(3, 'staff', 'Gestión de Personal', 1),
(3, 'reports', 'Reportes Completos', 1),
(3, 'appointments', 'Agenda de Citas', 1),
(3, 'api_access', 'Acceso a API', 1),
(3, 'multi_location', 'Multi-sucursal', 1),
(3, 'priority_support', 'Soporte Prioritario', 1)
ON DUPLICATE KEY UPDATE 
  `feature_name` = VALUES(`feature_name`),
  `is_enabled` = VALUES(`is_enabled`);
