USE mavishop_veterinaria;

-- Insertar usuarios de prueba
-- Password para todos: admin123 (hasheado con bcrypt)
INSERT INTO users (name, email, password, role, phone) VALUES
('Dr. Carlos Méndez', 'carlos@veterinaria.com', '$2a$10$rKvWJZhQxLZxF5xQYxQxQeYxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ', 'admin', '555-0101'),
('Dra. Ana García', 'ana@veterinaria.com', '$2a$10$rKvWJZhQxLZxF5xQYxQxQeYxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ', 'veterinario', '555-0102'),
('María López', 'maria@veterinaria.com', '$2a$10$rKvWJZhQxLZxF5xQYxQxQeYxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ', 'asistente', '555-0103'),
('Pedro Ramírez', 'pedro@veterinaria.com', '$2a$10$rKvWJZhQxLZxF5xQYxQxQeYxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ', 'recepcionista', '555-0104');

-- Insertar pacientes de prueba
INSERT INTO patients (name, owner, species, breed, age, weight, sex, color, medical_history, allergies) VALUES
('Max', 'Juan Pérez', 'Perro', 'Labrador', 5, 30.5, 'Macho', 'Dorado', 'Vacunas al día. Cirugía de cadera en 2022.', 'Ninguna conocida'),
('Luna', 'María González', 'Gato', 'Siamés', 3, 4.2, 'Hembra', 'Crema', 'Esterilizada. Tratamiento dental en 2023.', 'Alérgica a pescado'),
('Rocky', 'Carlos Martínez', 'Perro', 'Pastor Alemán', 7, 35.0, 'Macho', 'Negro y café', 'Displasia de cadera. Medicación diaria.', 'Ninguna'),
('Michi', 'Ana Rodríguez', 'Gato', 'Persa', 2, 5.5, 'Macho', 'Blanco', 'Saludable. Vacunas completas.', 'Ninguna'),
('Toby', 'Luis Hernández', 'Perro', 'Beagle', 4, 12.0, 'Macho', 'Tricolor', 'Problemas de peso. Dieta especial.', 'Ninguna'),
('Pelusa', 'Carmen Silva', 'Gato', 'Angora', 6, 4.8, 'Hembra', 'Gris', 'Artritis leve. Tratamiento mensual.', 'Alérgica a pollo'),
('Bruno', 'Roberto Torres', 'Perro', 'Bulldog', 3, 25.0, 'Macho', 'Blanco', 'Problemas respiratorios leves.', 'Ninguna'),
('Nala', 'Patricia Vega', 'Gato', 'Mestizo', 1, 3.5, 'Hembra', 'Naranja', 'Cachorra. Primera consulta.', 'Ninguna');

-- Insertar personal
INSERT INTO staff (name, last_name, position, email, phone, salary, license, hire_date) VALUES
('Carlos', 'Méndez', 'Veterinario', 'carlos.mendez@vet.com', '555-1001', 25000.00, 'VET-12345', '2020-01-15'),
('Ana', 'García', 'Veterinario', 'ana.garcia@vet.com', '555-1002', 24000.00, 'VET-12346', '2020-03-20'),
('María', 'López', 'Asistente', 'maria.lopez@vet.com', '555-1003', 12000.00, NULL, '2021-06-10'),
('Pedro', 'Ramírez', 'Recepcionista', 'pedro.ramirez@vet.com', '555-1004', 10000.00, NULL, '2021-08-05'),
('Laura', 'Sánchez', 'Asistente', 'laura.sanchez@vet.com', '555-1005', 12500.00, NULL, '2022-01-12'),
('Jorge', 'Morales', 'Administrador', 'jorge.morales@vet.com', '555-1006', 18000.00, NULL, '2019-11-01');

-- Insertar inventario
INSERT INTO inventory (name, category, type, stock, price, cost, unit, description, expiry_date, supplier) VALUES
('Vacuna Antirrábica', 'Medicamento', 'Vacuna', 50, 250.00, 150.00, 'Dosis', 'Vacuna contra la rabia', '2025-12-31', 'MedVet SA'),
('Antibiótico Amoxicilina', 'Medicamento', 'Antibiótico', 100, 180.00, 100.00, 'Caja', 'Antibiótico de amplio espectro', '2025-06-30', 'FarmaVet'),
('Desparasitante', 'Medicamento', 'Antiparasitario', 75, 120.00, 70.00, 'Tableta', 'Desparasitante interno', '2025-09-15', 'MedVet SA'),
('Shampoo Medicado', 'Producto', 'Higiene', 30, 150.00, 80.00, 'Botella', 'Shampoo para piel sensible', '2026-03-20', 'PetCare'),
('Collar Antipulgas', 'Producto', 'Prevención', 40, 200.00, 120.00, 'Unidad', 'Collar antipulgas 8 meses', '2026-12-31', 'PetCare'),
('Consulta General', 'Servicio', 'Consulta', 999, 350.00, 0.00, 'Servicio', 'Consulta veterinaria general', NULL, NULL),
('Cirugía Menor', 'Servicio', 'Cirugía', 999, 2500.00, 0.00, 'Servicio', 'Procedimiento quirúrgico menor', NULL, NULL),
('Alimento Premium Perro', 'Alimento', 'Perro', 25, 850.00, 600.00, '15kg', 'Alimento premium para perros adultos', '2025-08-30', 'NutriPet'),
('Alimento Premium Gato', 'Alimento', 'Gato', 20, 650.00, 450.00, '10kg', 'Alimento premium para gatos adultos', '2025-08-30', 'NutriPet'),
('Snacks Dentales', 'Producto', 'Snack', 60, 95.00, 50.00, 'Paquete', 'Snacks para limpieza dental', '2025-11-15', 'PetCare');

-- Insertar consultas
INSERT INTO consultations (patient_id, patient_name, owner_name, reason, diagnosis, treatment, notes, consultation_date, veterinarian, status, cost) VALUES
(1, 'Max', 'Juan Pérez', 'Vacunación anual', 'Saludable', 'Vacuna antirrábica aplicada', 'Próxima cita en 1 año', '2024-01-15 10:00:00', 'Dr. Carlos Méndez', 'Completada', 600.00),
(2, 'Luna', 'María González', 'Revisión dental', 'Sarro leve', 'Limpieza dental programada', 'Requiere anestesia', '2024-01-20 14:30:00', 'Dra. Ana García', 'Completada', 1200.00),
(3, 'Rocky', 'Carlos Martínez', 'Control de displasia', 'Displasia moderada', 'Continuar medicación', 'Radiografías en 3 meses', '2024-02-05 11:00:00', 'Dr. Carlos Méndez', 'Completada', 800.00),
(4, 'Michi', 'Ana Rodríguez', 'Vacunación', 'Saludable', 'Vacunas aplicadas', 'Todo en orden', '2024-02-10 09:30:00', 'Dra. Ana García', 'Completada', 550.00),
(5, 'Toby', 'Luis Hernández', 'Control de peso', 'Sobrepeso', 'Dieta especial prescrita', 'Control en 1 mes', '2024-02-15 15:00:00', 'Dr. Carlos Méndez', 'Completada', 400.00),
(1, 'Max', 'Juan Pérez', 'Revisión general', 'Pendiente', 'Pendiente', 'Cita programada', '2024-12-20 10:00:00', 'Dr. Carlos Méndez', 'Programada', 350.00),
(6, 'Pelusa', 'Carmen Silva', 'Control artritis', 'Pendiente', 'Pendiente', 'Cita programada', '2024-12-22 11:30:00', 'Dra. Ana García', 'Programada', 450.00);

-- Insertar registros contables
INSERT INTO accounting (type, category, amount, description, reference, transaction_date, payment_method, created_by) VALUES
('Ingreso', 'Consultas', 3550.00, 'Consultas del día', 'CONS-001', '2024-01-15', 'Efectivo', 'Pedro Ramírez'),
('Ingreso', 'Ventas', 1850.00, 'Venta de productos', 'VENTA-001', '2024-01-15', 'Tarjeta', 'Pedro Ramírez'),
('Egreso', 'Compras', 5000.00, 'Compra de medicamentos', 'COMP-001', '2024-01-16', 'Transferencia', 'Jorge Morales'),
('Egreso', 'Servicios', 1200.00, 'Pago de luz y agua', 'SERV-001', '2024-01-20', 'Transferencia', 'Jorge Morales'),
('Nómina', 'Sueldos', 25000.00, 'Pago quincena enero', 'NOM-001', '2024-01-31', 'Transferencia', 'Jorge Morales'),
('Ingreso', 'Consultas', 4200.00, 'Consultas del día', 'CONS-002', '2024-02-05', 'Efectivo', 'Pedro Ramírez'),
('Egreso', 'Mantenimiento', 3500.00, 'Reparación de equipo', 'MANT-001', '2024-02-10', 'Efectivo', 'Jorge Morales');

-- Insertar ventas de ejemplo
INSERT INTO sales (sale_number, customer_name, subtotal, tax, discount, total, payment_method, amount_paid, change_amount, notes, cashier, sale_date) VALUES
('VTA-2024-001', 'Juan Pérez', 850.00, 136.00, 0.00, 986.00, 'Efectivo', 1000.00, 14.00, 'Venta de alimento premium', 'Pedro Ramírez', '2024-01-15 10:30:00'),
('VTA-2024-002', 'María González', 470.00, 75.20, 50.00, 495.20, 'Tarjeta', 495.20, 0.00, 'Productos de higiene', 'Pedro Ramírez', '2024-01-15 14:20:00'),
('VTA-2024-003', 'Carlos Martínez', 320.00, 51.20, 0.00, 371.20, 'Efectivo', 400.00, 28.80, 'Medicamentos', 'Pedro Ramírez', '2024-02-05 11:45:00');

-- Insertar items de venta
INSERT INTO sale_items (sale_id, inventory_id, item_name, quantity, unit_price, subtotal) VALUES
(1, 8, 'Alimento Premium Perro', 1, 850.00, 850.00),
(2, 4, 'Shampoo Medicado', 2, 150.00, 300.00),
(2, 5, 'Collar Antipulgas', 1, 200.00, 200.00),
(3, 2, 'Antibiótico Amoxicilina', 1, 180.00, 180.00),
(3, 3, 'Desparasitante', 1, 120.00, 120.00);
