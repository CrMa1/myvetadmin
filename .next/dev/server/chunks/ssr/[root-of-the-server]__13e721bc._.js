module.exports = [
"[next]/internal/font/google/geist_9a252bad.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_9a252bad-module__rsvCoW__className",
});
}),
"[next]/internal/font/google/geist_9a252bad.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_9a252bad$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_9a252bad.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_9a252bad$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', 'Geist Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_9a252bad$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_9a252bad$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_8ea776c3.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_8ea776c3-module__ryDx5G__className",
});
}),
"[next]/internal/font/google/geist_mono_8ea776c3.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8ea776c3$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_8ea776c3.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8ea776c3$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', 'Geist Mono Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8ea776c3$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8ea776c3$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/lib/config.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clinicConfig",
    ()=>clinicConfig,
    "db",
    ()=>db,
    "generateMockData",
    ()=>generateMockData,
    "initializeDatabase",
    ()=>initializeDatabase
]);
const clinicConfig = {
    name: "MyVetAdmin",
    tagline: "Sistema de Gestión Veterinaria Profesional",
    phone: "+52 (55) 1234-5678",
    email: "contacto@myvetadmin.com",
    address: "Av. Principal 123, Ciudad de México",
    logo: "🐾",
    domain: "https://www.myvetadmin.com",
    hours: {
        weekdays: "9:00 AM - 7:00 PM",
        saturday: "9:00 AM - 3:00 PM",
        sunday: "Cerrado"
    },
    colors: {
        primary: "oklch(0.55 0.08 145)",
        secondary: "oklch(0.88 0.03 85)",
        accent: "oklch(0.60 0.15 50)"
    }
};
const db = {
    users: [],
    patients: [],
    staff: [],
    accounting: [],
    inventory: [],
    appointments: [],
    consultations: [],
    sales: [],
    userProfile: null
};
const initializeDatabase = ()=>{
    if (db.patients.length === 0) {
        db.users = [
            {
                id: "USR-1001",
                email: "admin@vetcarepro.com",
                password: "admin123",
                firstName: "Juan",
                lastName: "Pérez",
                phone: "55-1234-5678",
                position: "Veterinario Principal",
                license: "LIC-123456",
                specialization: "Medicina General",
                avatar: "👨‍⚕️",
                createdAt: new Date().toISOString()
            }
        ];
        db.patients = generateMockData.patients(20);
        db.staff = generateMockData.staff(10);
        db.accounting = generateMockData.accounting(30);
        db.inventory = generateMockData.inventory(30);
        db.appointments = generateMockData.appointments(10);
        db.consultations = generateMockData.consultations(15);
        db.sales = generateMockData.sales(30);
        db.userProfile = db.users[0];
    }
};
const generateMockData = {
    sales: (days = 30)=>{
        const data = [];
        const today = new Date();
        for(let i = days - 1; i >= 0; i--){
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split("T")[0],
                amount: Math.floor(Math.random() * 15000) + 5000,
                transactions: Math.floor(Math.random() * 20) + 5
            });
        }
        return data;
    },
    appointments: (count = 10)=>{
        const animals = [
            "Perro",
            "Gato",
            "Conejo",
            "Hámster",
            "Ave"
        ];
        const reasons = [
            "Consulta general",
            "Vacunación",
            "Cirugía",
            "Emergencia",
            "Control"
        ];
        const data = [];
        for(let i = 0; i < count; i++){
            const date = new Date();
            date.setHours(date.getHours() + Math.floor(Math.random() * 72));
            data.push({
                id: `APT-${1000 + i}`,
                patientName: `Mascota ${i + 1}`,
                animalType: animals[Math.floor(Math.random() * animals.length)],
                ownerName: `Dueño ${i + 1}`,
                date: date.toISOString(),
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                status: Math.random() > 0.3 ? "Confirmada" : "Pendiente"
            });
        }
        return data.sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    patients: (count = 20)=>{
        const animals = [
            "Perro",
            "Gato",
            "Conejo",
            "Hámster",
            "Ave",
            "Reptil"
        ];
        const breeds = {
            Perro: [
                "Labrador",
                "Chihuahua",
                "Pastor Alemán",
                "Bulldog",
                "Mestizo"
            ],
            Gato: [
                "Persa",
                "Siamés",
                "Angora",
                "Mestizo",
                "Maine Coon"
            ],
            Conejo: [
                "Holandés",
                "Angora",
                "Rex",
                "Mestizo"
            ],
            Hámster: [
                "Sirio",
                "Ruso",
                "Roborovski"
            ],
            Ave: [
                "Canario",
                "Periquito",
                "Loro",
                "Cacatúa"
            ],
            Reptil: [
                "Iguana",
                "Tortuga",
                "Gecko"
            ]
        };
        const data = [];
        for(let i = 0; i < count; i++){
            const animalType = animals[Math.floor(Math.random() * animals.length)];
            const breedList = breeds[animalType];
            data.push({
                id: `PAT-${2000 + i}`,
                name: `Mascota ${i + 1}`,
                animalType,
                breed: breedList[Math.floor(Math.random() * breedList.length)],
                age: Math.floor(Math.random() * 15) + 1,
                weight: (Math.random() * 30 + 2).toFixed(1),
                sex: Math.random() > 0.5 ? "Macho" : "Hembra",
                ownerName: `Dueño ${i + 1}`,
                ownerPhone: `55-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
                medicalHistory: "Sin antecedentes relevantes",
                diseases: Math.random() > 0.7 ? "Ninguna" : "Alergias estacionales",
                lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return data;
    },
    staff: (count = 10)=>{
        const positions = [
            "Veterinario",
            "Asistente Médico",
            "Recepcionista",
            "Técnico"
        ];
        const data = [];
        for(let i = 0; i < count; i++){
            const position = positions[Math.floor(Math.random() * positions.length)];
            data.push({
                id: `STF-${3000 + i}`,
                firstName: `Nombre${i + 1}`,
                lastName: `Apellido${i + 1}`,
                position,
                email: `empleado${i + 1}@vetcarepro.com`,
                phone: `55-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
                salary: position === "Veterinario" ? 25000 : position === "Asistente Médico" ? 15000 : 12000,
                license: position === "Veterinario" ? `LIC-${Math.floor(Math.random() * 900000) + 100000}` : "N/A",
                hireDate: new Date(Date.now() - Math.random() * 365 * 3 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        return data;
    },
    accounting: (count = 30)=>{
        const incomeTypes = [
            "Consulta",
            "Cirugía",
            "Vacunación",
            "Medicamentos",
            "Productos"
        ];
        const expenseTypes = [
            "Nómina",
            "Suministros",
            "Servicios",
            "Mantenimiento",
            "Renta"
        ];
        const data = [];
        for(let i = 0; i < count; i++){
            const isIncome = Math.random() > 0.4;
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60));
            data.push({
                id: `ACC-${4000 + i}`,
                type: isIncome ? "Ingreso" : "Egreso",
                category: isIncome ? incomeTypes[Math.floor(Math.random() * incomeTypes.length)] : expenseTypes[Math.floor(Math.random() * expenseTypes.length)],
                amount: isIncome ? Math.floor(Math.random() * 5000) + 500 : Math.floor(Math.random() * 8000) + 1000,
                date: date.toISOString(),
                description: `Descripción de ${isIncome ? "ingreso" : "egreso"}`,
                status: Math.random() > 0.2 ? "Completado" : "Pendiente"
            });
        }
        return data.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    inventory: (count = 30)=>{
        const categories = [
            "Medicamento",
            "Alimento",
            "Producto",
            "Servicio"
        ];
        const medicationTypes = [
            "Antibiótico",
            "Antiinflamatorio",
            "Analgésico",
            "Vitamina"
        ];
        const foodTypes = [
            "Croquetas",
            "Alimento húmedo",
            "Snacks",
            "Suplemento"
        ];
        const data = [];
        for(let i = 0; i < count; i++){
            const category = categories[Math.floor(Math.random() * categories.length)];
            let specificData = {};
            if (category === "Medicamento") {
                specificData = {
                    medicationType: medicationTypes[Math.floor(Math.random() * medicationTypes.length)],
                    dosage: `${Math.floor(Math.random() * 500) + 50}mg`,
                    presentation: Math.random() > 0.5 ? "Tabletas" : "Inyectable"
                };
            } else if (category === "Alimento") {
                specificData = {
                    foodType: foodTypes[Math.floor(Math.random() * foodTypes.length)],
                    weight: `${Math.floor(Math.random() * 10) + 1}kg`,
                    brand: `Marca ${Math.floor(Math.random() * 5) + 1}`
                };
            }
            data.push({
                id: `INV-${5000 + i}`,
                name: `${category} ${i + 1}`,
                category,
                stock: Math.floor(Math.random() * 100) + 10,
                minStock: 20,
                price: Math.floor(Math.random() * 1000) + 100,
                supplier: `Proveedor ${Math.floor(Math.random() * 5) + 1}`,
                ...specificData
            });
        }
        return data;
    },
    consultations: (count = 15)=>{
        const reasons = [
            "Consulta general",
            "Vacunación",
            "Revisión post-operatoria",
            "Problemas digestivos",
            "Problemas de piel",
            "Control de peso",
            "Emergencia"
        ];
        const diagnoses = [
            "Saludable",
            "Infección leve",
            "Requiere seguimiento",
            "Tratamiento prescrito",
            "Observación"
        ];
        const data = [];
        for(let i = 0; i < count; i++){
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));
            const patientId = `PAT-${2000 + Math.floor(Math.random() * 20)}`;
            data.push({
                id: `CONS-${6000 + i}`,
                patientId,
                patientName: `Mascota ${Math.floor(Math.random() * 20) + 1}`,
                ownerName: `Dueño ${Math.floor(Math.random() * 20) + 1}`,
                accompaniedBy: `Persona ${Math.floor(Math.random() * 5) + 1}`,
                date: date.toISOString(),
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
                treatment: "Tratamiento recomendado según diagnóstico",
                notes: "Observaciones adicionales del veterinario",
                veterinarian: `Dr. Veterinario ${Math.floor(Math.random() * 5) + 1}`,
                cost: Math.floor(Math.random() * 2000) + 300
            });
        }
        return data.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    userProfile: ()=>{
        return {
            id: "USR-1001",
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan.perez@vetcarepro.com",
            phone: "55-1234-5678",
            position: "Veterinario Principal",
            license: "LIC-123456",
            specialization: "Medicina General",
            experience: "10 años",
            avatar: "👨‍⚕️",
            address: "Calle Principal 123, CDMX",
            emergencyContact: "55-9876-5432",
            hireDate: "2014-03-15"
        };
    }
};
}),
"[project]/contexts/auth-context.jsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AuthProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AuthProvider() from the server but AuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/contexts/auth-context.jsx <module evaluation>", "AuthProvider");
const useAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useAuth() from the server but useAuth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/contexts/auth-context.jsx <module evaluation>", "useAuth");
}),
"[project]/contexts/auth-context.jsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AuthProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AuthProvider() from the server but AuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/contexts/auth-context.jsx", "AuthProvider");
const useAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useAuth() from the server but useAuth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/contexts/auth-context.jsx", "useAuth");
}),
"[project]/contexts/auth-context.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/contexts/auth-context.jsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.jsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/components/layout/layout-content.jsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "LayoutContent",
    ()=>LayoutContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LayoutContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LayoutContent() from the server but LayoutContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/layout/layout-content.jsx <module evaluation>", "LayoutContent");
}),
"[project]/components/layout/layout-content.jsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "LayoutContent",
    ()=>LayoutContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const LayoutContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LayoutContent() from the server but LayoutContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/layout/layout-content.jsx", "LayoutContent");
}),
"[project]/components/layout/layout-content.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$layout$2d$content$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/layout/layout-content.jsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$layout$2d$content$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/layout/layout-content.jsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$layout$2d$content$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/layout.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_9a252bad$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_9a252bad.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8ea776c3$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_8ea776c3.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$layout$2d$content$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/layout-content.jsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
const metadata = {
    title: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clinicConfig"].name} - Sistema de Gestión`,
    description: "Sistema de gestión integral para clínica veterinaria",
    generator: "v0.app"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "es",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "font-sans antialiased",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$layout$2d$content$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LayoutContent"], {
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/layout.jsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/layout.jsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Analytics"], {}, void 0, false, {
                    fileName: "[project]/app/layout.jsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/layout.jsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/layout.jsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Analytics",
    ()=>Analytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Analytics() from the server but Analytics is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/node_modules/@vercel/analytics/dist/next/index.mjs <module evaluation>", "Analytics");
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Analytics",
    ()=>Analytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Analytics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Analytics() from the server but Analytics is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/node_modules/@vercel/analytics/dist/next/index.mjs", "Analytics");
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__13e721bc._.js.map