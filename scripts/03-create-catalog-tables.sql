-- Tabla de especies para pacientes
CREATE TABLE IF NOT EXISTS species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de puestos para personal
CREATE TABLE IF NOT EXISTS positions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías para contabilidad
CREATE TABLE IF NOT EXISTS conta_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  type ENUM('income', 'expense') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías para inventario
CREATE TABLE IF NOT EXISTS item_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar especies predeterminadas
INSERT INTO species (name, description) VALUES
('Perro', 'Canino doméstico'),
('Gato', 'Felino doméstico'),
('Ave', 'Aves de compañía'),
('Conejo', 'Lagomorfo'),
('Hámster', 'Roedor pequeño'),
('Reptil', 'Reptiles varios'),
('Otro', 'Otras especies')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar puestos predeterminados
INSERT INTO positions (name, description) VALUES
('Veterinario', 'Médico veterinario'),
('Asistente Veterinario', 'Asistente de veterinario'),
('Recepcionista', 'Encargado de recepción'),
('Administrador', 'Administrador del consultorio'),
('Enfermero', 'Enfermero veterinario'),
('Otro', 'Otro puesto')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar categorías de contabilidad predeterminadas
INSERT INTO conta_categories (name, type, description) VALUES
('Consultas', 'income', 'Ingresos por consultas veterinarias'),
('Cirugías', 'income', 'Ingresos por cirugías'),
('Ventas de productos', 'income', 'Ventas de medicamentos y productos'),
('Otros ingresos', 'income', 'Otros ingresos diversos'),
('Sueldos', 'expense', 'Pago de sueldos'),
('Compra de inventario', 'expense', 'Compra de medicamentos y suministros'),
('Servicios', 'expense', 'Pago de servicios (luz, agua, etc)'),
('Renta', 'expense', 'Pago de renta del local'),
('Otros gastos', 'expense', 'Otros gastos diversos')
ON DUPLICATE KEY UPDATE name=name;

-- Insertar categorías de inventario predeterminadas
INSERT INTO item_categories (name, description) VALUES
('Medicamento', 'Medicamentos veterinarios'),
('Alimento', 'Alimentos para mascotas'),
('Accesorio', 'Accesorios y juguetes'),
('Suministro', 'Suministros médicos'),
('Higiene', 'Productos de higiene'),
('Otro', 'Otros productos')
ON DUPLICATE KEY UPDATE name=name;

-- Modificar tabla de pacientes para usar species_id
ALTER TABLE patients 
ADD COLUMN species_id INT,
ADD FOREIGN KEY (species_id) REFERENCES species(id);

-- Modificar tabla de personal para usar position_id
ALTER TABLE staff 
ADD COLUMN position_id INT,
ADD FOREIGN KEY (position_id) REFERENCES positions(id);

-- Modificar tabla de contabilidad para usar category_id
ALTER TABLE accounting 
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES conta_categories(id);

-- Modificar tabla de inventario para usar category_id
ALTER TABLE inventory 
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES item_categories(id);
