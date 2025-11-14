// Catálogo de productos para Stripe Checkout
// Este archivo define los planes disponibles para compra

export const PRODUCTS = [
  {
    id: "price_1ST7U31LGdPqIkO0bpfkijHK",
    planId: 1, // Referencia al ID en la base de datos
    name: "Plan Básico - Mensual",
    billingCycle: "monthly",
    description: "Perfecto para clínicas pequeñas",
    priceInCents: 29900, // $299.00 MXN
  },
  {
    id: "price_1ST9mo1LGdPqIkO00SK37B7p",
    planId: 1,
    name: "Plan Básico - Anual",
    billingCycle: "yearly",
    description: "Ahorra 17% pagando anualmente",
    priceInCents: 299000, // $2,990.00 MXN
  },
  {
    id: "price_1ST9nG1LGdPqIkO0qwjJDoQg",
    planId: 2,
    name: "Plan Profesional - Mensual",
    billingCycle: "monthly",
    description: "Ideal para clínicas en crecimiento",
    priceInCents: 59900, // $599.00 MXN
  },
  {
    id: "plan-profesional-yearly",
    planId: 2,
    name: "Plan Profesional - Anual",
    billingCycle: "yearly",
    description: "Ahorra 17% pagando anualmente",
    priceInCents: 599000, // $5,990.00 MXN
  },
  {
    id: "plan-empresarial-monthly",
    planId: 3,
    name: "Plan Empresarial - Mensual",
    billingCycle: "monthly",
    description: "La solución completa para grandes clínicas",
    priceInCents: 119900, // $1,199.00 MXN
  },
  {
    id: "plan-empresarial-yearly",
    planId: 3,
    name: "Plan Empresarial - Anual",
    billingCycle: "yearly",
    description: "Ahorra 17% pagando anualmente",
    priceInCents: 1199000, // $11,990.00 MXN
  },
]

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByPlanId(planId) {
  return PRODUCTS.filter((p) => p.planId === planId)
}
