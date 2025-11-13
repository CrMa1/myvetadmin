-- Insertar planes de suscripción iniciales
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, discount_yearly, features, max_users, max_patients, display_order) VALUES
(
  'Plan Básico',
  'Perfecto para clínicas pequeñas que están comenzando',
  299.00,
  2990.00,
  17,
  '["Gestión de hasta 100 pacientes", "1 usuario", "Dashboard básico", "Historial de consultas", "Soporte por email"]',
  1,
  100,
  1
),
(
  'Plan Profesional',
  'Ideal para clínicas en crecimiento con múltiples veterinarios',
  599.00,
  5990.00,
  17,
  '["Pacientes ilimitados", "Hasta 5 usuarios", "Dashboard avanzado", "Gestión de inventario", "Gestión de personal", "Reportes avanzados", "Soporte prioritario"]',
  5,
  NULL,
  2
),
(
  'Plan Empresarial',
  'La solución completa para clínicas grandes y cadenas veterinarias',
  1199.00,
  11990.00,
  17,
  '["Todo del Plan Profesional", "Usuarios ilimitados", "Múltiples sucursales", "API personalizada", "Soporte dedicado 24/7", "Capacitación personalizada", "Integraciones personalizadas"]',
  NULL,
  NULL,
  3
);

-- Insertar promociones de ejemplo
INSERT INTO promotions (title, description, image_url, link_text, is_active, display_order) VALUES
(
  '¡Lanzamiento Especial!',
  'Obtén 3 meses gratis al contratar cualquier plan anual durante este mes. No pierdas esta oportunidad única.',
  '/placeholder.svg?height=400&width=800',
  'Ver Planes',
  TRUE,
  1
),
(
  'Webinar Gratuito',
  'Aprende cómo digitalizar tu clínica veterinaria en nuestro webinar gratuito. Próximo jueves 20:00 hrs.',
  '/placeholder.svg?height=400&width=800',
  'Registrarse Gratis',
  TRUE,
  2
);

-- Insertar testimonios de ejemplo
INSERT INTO testimonials (name, clinic_name, role, rating, comment, is_featured, is_active, display_order) VALUES
(
  'Dr. Carlos Hernández',
  'Clínica Veterinaria Huellitas',
  'Director Médico',
  5,
  'Este sistema ha transformado completamente la forma en que administramos nuestra clínica. Ahora podemos atender más pacientes y llevar un mejor control del inventario.',
  TRUE,
  TRUE,
  1
),
(
  'Dra. María González',
  'Hospital Veterinario del Centro',
  'Veterinaria',
  5,
  'La interfaz es muy intuitiva y fácil de usar. Mis asistentes aprendieron a usarlo en menos de una hora. Excelente inversión.',
  TRUE,
  TRUE,
  2
),
(
  'Lic. Roberto Martínez',
  'Veterinaria Patitas Felices',
  'Administrador',
  5,
  'El módulo de contabilidad me ha ahorrado muchísimo tiempo. Ahora puedo generar reportes en segundos y tener control total de mis finanzas.',
  TRUE,
  TRUE,
  3
),
(
  'Dra. Ana López',
  'Clínica Veterinaria San Francisco',
  'Veterinaria',
  4,
  'Muy buen sistema, cumple con todo lo que necesitamos. El soporte técnico es rápido y eficiente.',
  FALSE,
  TRUE,
  4
);
