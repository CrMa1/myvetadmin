module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/stripe.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stripe",
    ()=>stripe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
;
;
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}
const stripe = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia"
});
}),
"[project]/lib/products.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Catálogo de productos para Stripe Checkout
// Este archivo define los planes disponibles para compra
__turbopack_context__.s([
    "PRODUCTS",
    ()=>PRODUCTS,
    "getProductById",
    ()=>getProductById,
    "getProductsByPlanId",
    ()=>getProductsByPlanId
]);
const PRODUCTS = [
    {
        id: "price_1ST7U31LGdPqIkO0bpfkijHK",
        planId: 1,
        name: "Plan Básico - Mensual",
        billingCycle: "monthly",
        description: "Perfecto para clínicas pequeñas",
        priceInCents: 29900
    },
    {
        id: "price_1ST9mo1LGdPqIkO00SK37B7p",
        planId: 1,
        name: "Plan Básico - Anual",
        billingCycle: "yearly",
        description: "Ahorra 17% pagando anualmente",
        priceInCents: 299000
    },
    {
        id: "price_1ST9nG1LGdPqIkO0qwjJDoQg",
        planId: 2,
        name: "Plan Profesional - Mensual",
        billingCycle: "monthly",
        description: "Ideal para clínicas en crecimiento",
        priceInCents: 59900
    },
    {
        id: "plan-profesional-yearly",
        planId: 2,
        name: "Plan Profesional - Anual",
        billingCycle: "yearly",
        description: "Ahorra 17% pagando anualmente",
        priceInCents: 599000
    },
    {
        id: "plan-empresarial-monthly",
        planId: 3,
        name: "Plan Empresarial - Mensual",
        billingCycle: "monthly",
        description: "La solución completa para grandes clínicas",
        priceInCents: 119900
    },
    {
        id: "plan-empresarial-yearly",
        planId: 3,
        name: "Plan Empresarial - Anual",
        billingCycle: "yearly",
        description: "Ahorra 17% pagando anualmente",
        priceInCents: 1199000
    }
];
function getProductById(id) {
    return PRODUCTS.find((p)=>p.id === id);
}
function getProductsByPlanId(planId) {
    return PRODUCTS.filter((p)=>p.planId === planId);
}
}),
"[project]/app/api/stripe/create-checkout/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stripe.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/products.js [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { productId, userData } = await request.json();
        console.log("[v0] Creating checkout session for product:", productId);
        console.log("[v0] User data TODO:", userData);
        console.log("[v0] User data:", {
            email: userData.email,
            name: userData.firstName
        });
        const product = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProductById"])(productId);
        if (!product) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Producto no encontrado"
            }, {
                status: 404
            });
        }
        // Create or retrieve Stripe customer
        let customer;
        const existingCustomers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripe"].customers.list({
            email: userData.email,
            limit: 1
        });
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            console.log("[v0] Existing customer found:", customer.id);
        } else {
            console.log("[v0] New customer creating:", userData);
            customer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripe"].customers.create({
                email: userData.email,
                name: `${userData.firstName} ${userData.lastName}`,
                phone: userData.phone,
                metadata: {
                    userId: userData.userId || "pending"
                }
            });
            console.log("[v0] New customer created:", customer.id);
        }
        // Create checkout session for subscription
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripe"].checkout.sessions.create({
            customer: customer.id,
            ui_mode: "embedded",
            redirect_on_completion: "never",
            line_items: [
                {
                    price_data: {
                        currency: "mxn",
                        product_data: {
                            name: product.name,
                            description: product.description
                        },
                        unit_amount: product.priceInCents,
                        recurring: product.billingCycle === "yearly" ? {
                            interval: "year"
                        } : {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            mode: "subscription",
            metadata: {
                productId: product.id,
                planId: product.planId.toString(),
                billingCycle: product.billingCycle,
                userId: userData.userId || "pending"
            }
        });
        console.log("[v0] Checkout session created:", session.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clientSecret: session.client_secret
        });
    } catch (error) {
        console.error("[v0] Error creating checkout session:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al crear sesión de pago"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd04b2b2._.js.map