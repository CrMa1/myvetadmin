// Mapa de módulos del sistema con sus identificadores
export const MODULES = {
  DASHBOARD: "DASHBOARD",
  SELL: "SELL",
  CLIENTS: "CLIENTS",
  PATIENTS: "PATIENTS",
  CONSULTATIONS: "CONSULTATIONS",
  STAFF: "STAFF",
  ACCOUNTING: "ACCOUNTING",
  INVENTORY: "INVENTORY",
  CLINICS: "CLINICS",
  PROFILE: "PROFILE",
  PURCHASES: "PURCHASES",
}

// Mapa de rutas a módulos
export const ROUTE_MODULE_MAP = {
  "/": MODULES.DASHBOARD,
  "/vender": MODULES.SELL,
  "/clientes": MODULES.CLIENTS,
  "/pacientes": MODULES.PATIENTS,
  "/consultas": MODULES.CONSULTATIONS,
  "/personal": MODULES.STAFF,
  "/contabilidad": MODULES.ACCOUNTING,
  "/inventario": MODULES.INVENTORY,
  "/consultorios": MODULES.CLINICS,
  "/perfil": MODULES.PROFILE,
  "/compras": MODULES.PURCHASES,
}

// Función para verificar si un usuario tiene acceso a un módulo
export function hasModuleAccess(planFeatures, moduleKey) {
  if (!planFeatures || !moduleKey) return false

  // Dashboard, perfil y compras siempre están disponibles
  if (moduleKey === MODULES.DASHBOARD || moduleKey === MODULES.PROFILE || moduleKey === MODULES.PURCHASES) {
    return true
  }

  const moduleFeature = planFeatures.find((feature) => feature.feature_code === moduleKey && feature.is_enabled)

  return moduleFeature !== undefined
}

// Función para obtener el módulo desde una ruta
export function getModuleFromRoute(pathname) {
  // Verificar rutas exactas
  if (ROUTE_MODULE_MAP[pathname]) {
    return ROUTE_MODULE_MAP[pathname]
  }

  // Verificar rutas dinámicas (ej: /clientes/123)
  for (const [route, module] of Object.entries(ROUTE_MODULE_MAP)) {
    if (pathname.startsWith(route) && route !== "/") {
      return module
    }
  }

  return null
}

// Función para verificar si el usuario puede acceder a una ruta
export function canAccessRoute(planFeatures, pathname) {
  const module = getModuleFromRoute(pathname)

  if (!module) {
    // Si no está mapeada, permitir acceso (rutas públicas o especiales)
    return true
  }

  return hasModuleAccess(planFeatures, module)
}
