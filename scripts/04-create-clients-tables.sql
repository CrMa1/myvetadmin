-- Tabla de estados de clientes
CREATE TABLE IF NOT EXISTS client_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar estados predeterminados
INSERT INTO client_status (name, description) VALUES
('Nuevo', 'Cliente registrado recientemente'),
('Frecuente', 'Cliente con visitas regulares'),
('Especial', 'Cliente con necesidades especiales o VIP'),
('Inactivo', 'Cliente sin actividad reciente')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Tabla de clientes (dueños de mascotas)
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  clinic_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address TEXT,
  status_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES client_status(id),
  INDEX idx_user_clinic (user_id, clinic_id),
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_status (status_id),
  INDEX idx_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
