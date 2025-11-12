# Sistema de Gestión Veterinaria

Sistema completo de gestión para clínicas veterinarias con autenticación, punto de venta, inventario, contabilidad y más.

## Características

- 🔐 **Autenticación segura** con bcrypt
- 🐾 **Gestión de pacientes** (animales) con historial médico completo
- 👥 **Gestión de personal** y nómina
- 📅 **Sistema de consultas** y citas
- 💰 **Punto de venta** con actualización automática de inventario
- 📊 **Contabilidad** con reportes en tiempo real
- 📦 **Control de inventario** con alertas de stock bajo
- 📋 **Kardex de pacientes** con historial completo
- 👤 **Perfil de usuario** editable

## Requisitos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd veterinaria-app
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Editar `.env` con tus credenciales de base de datos.

4. **Configurar la base de datos**

Ejecutar los scripts SQL en orden:

\`\`\`bash
# Conectarse a MySQL
mysql -h 174.136.31.150 -u mavishop_myvetadmin -p

# Ejecutar scripts
source scripts/01-create-tables.sql
source scripts/02-seed-data.sql
\`\`\`

O copiar y pegar el contenido de cada archivo en tu cliente MySQL.

5. **Iniciar el servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## Credenciales de Prueba

Después de ejecutar el script de seed, puedes iniciar sesión con:

- **Email:** carlos@veterinaria.com
- **Password:** admin123

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── api/              # Rutas API de Next.js
│   │   ├── auth/         # Autenticación
│   │   ├── patients/     # Pacientes
│   │   ├── staff/        # Personal
│   │   ├── consultations/# Consultas
│   │   ├── inventory/    # Inventario
│   │   ├── accounting/   # Contabilidad
│   │   ├── sales/        # Ventas
│   │   └── dashboard/    # Dashboard
│   ├── login/            # Página de login
│   ├── registro/         # Página de registro
│   ├── pacientes/        # Gestión de pacientes
│   ├── personal/         # Gestión de personal
│   ├── consultas/        # Gestión de consultas
│   ├── inventario/       # Gestión de inventario
│   ├── contabilidad/     # Gestión contable
│   ├── vender/           # Punto de venta
│   ├── kardex/           # Kardex de pacientes
│   └── perfil/           # Perfil de usuario
├── components/           # Componentes React
├── contexts/             # Contextos de React
├── lib/                  # Utilidades
│   ├── db.js            # Conexión a MySQL
│   └── config.js        # Configuración global
└── scripts/             # Scripts SQL
    ├── 01-create-tables.sql
    └── 02-seed-data.sql
\`\`\`

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Consultas parametrizadas para prevenir SQL injection
- ✅ Validación de datos en frontend y backend
- ✅ Transacciones de base de datos para operaciones críticas
- ✅ Manejo de errores robusto

## Producción

Para desplegar en producción:

1. **Configurar variables de entorno** en tu plataforma de hosting
2. **Ejecutar build**
\`\`\`bash
npm run build
\`\`\`
3. **Iniciar servidor**
\`\`\`bash
npm start
\`\`\`

## Tecnologías

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de datos:** MySQL 8.0
- **Autenticación:** bcryptjs
- **UI Components:** Radix UI, shadcn/ui
- **Gráficas:** Recharts

## Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.
