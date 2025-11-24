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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getConnection",
    ()=>getConnection,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || "174.136.31.150",
    user: process.env.DB_USER || "mavishop_myvetadmin",
    password: process.env.DB_PASSWORD || "KDZ-2y_O#cmI^v7r",
    database: process.env.DB_NAME || "mavishop_myvetadmin",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};
// Pool de conexiones para mejor rendimiento
let pool;
async function getConnection() {
    if (!pool) {
        pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
    }
    return pool;
}
async function query(sql, params) {
    //console.log("[v0] Query params:", params)
    const connection = await getConnection();
    try {
        const [results] = await connection.execute(sql, params);
        //console.log("[v0] Query successful, rows returned:", Array.isArray(results) ? results.length : "single result")
        return results;
    } catch (error) {
        console.error("[v0] Database query error - Full details:");
        console.error("[v0] Query:", sql);
        console.error("[v0] Params:", params);
        console.error("[v0] Error message:", error.message);
        console.error("[v0] Error code:", error.code);
        console.error("[v0] Error sqlState:", error.sqlState);
        console.error("[v0] Error:", error);
        throw error;
    }
}
const __TURBOPACK__default__export__ = {
    getConnection,
    query
};
}),
"[project]/app/api/dashboard/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const clinicId = searchParams.get("clinicId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        if (!userId || !clinicId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "userId y clinicId son requeridos"
            }, {
                status: 400
            });
        }
        let dateCondition = "";
        const params = [
            userId,
            clinicId
        ];
        if (startDate && endDate) {
            dateCondition = "AND transaction_date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        } else {
            dateCondition = "AND transaction_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        }
        const [revenueResult] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? ${dateCondition}`, params);
        // Prepare params for consultation queries
        const consultationParams = [
            userId,
            clinicId
        ];
        let consultationDateCondition = "";
        if (startDate && endDate) {
            consultationDateCondition = "AND consultation_date BETWEEN ? AND ?";
            consultationParams.push(startDate, endDate);
        } else {
            consultationDateCondition = "AND consultation_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        }
        const [consultationRevenueResult] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT COALESCE(SUM(cost), 0) as total 
       FROM consultations 
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}`, consultationParams);
        const [expensesResult] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT COALESCE(SUM(amount), 0) as total 
       FROM accounting 
       WHERE type = 'Egreso' AND user_id = ? AND clinic_id = ? ${dateCondition}`, params);
        const [appointmentsResult] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT COUNT(*) as count 
       FROM consultations 
       WHERE status = 'Programada' AND user_id = ? AND clinic_id = ? AND consultation_date >= NOW()`, [
            userId,
            clinicId
        ]);
        const [patientsResult] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("SELECT COUNT(*) as count FROM patients WHERE user_id = ? AND clinic_id = ? AND client_id IS NOT NULL", [
            userId,
            clinicId
        ]);
        const salesData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT DATE(transaction_date) as date, SUM(amount) as revenue
       FROM accounting
       WHERE type = 'Ingreso' AND user_id = ? AND clinic_id = ? ${dateCondition}
       GROUP BY DATE(transaction_date)
       ORDER BY date ASC`, params);
        const consultationSalesData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT DATE(consultation_date) as date, SUM(cost) as revenue
       FROM consultations
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}
       GROUP BY DATE(consultation_date)
       ORDER BY date ASC`, consultationParams);
        const mergedSalesData = {};
        salesData.forEach((row)=>{
            const dateStr = row.date instanceof Date ? row.date.toISOString().split("T")[0] : row.date;
            mergedSalesData[dateStr] = (mergedSalesData[dateStr] || 0) + (Number.parseFloat(row.revenue) || 0);
        });
        consultationSalesData.forEach((row)=>{
            const dateStr = row.date instanceof Date ? row.date.toISOString().split("T")[0] : row.date;
            mergedSalesData[dateStr] = (mergedSalesData[dateStr] || 0) + (Number.parseFloat(row.revenue) || 0);
        });
        const incomeExpenseData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT 
        WEEK(transaction_date) as week,
        YEAR(transaction_date) as year,
        SUM(CASE WHEN type = 'Ingreso' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'Egreso' THEN amount ELSE 0 END) as expenses
       FROM accounting
       WHERE user_id = ? AND clinic_id = ? ${dateCondition}
       GROUP BY WEEK(transaction_date), YEAR(transaction_date)
       ORDER BY year ASC, week ASC
       LIMIT 8`, params);
        const consultationIncomeByWeek = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT 
        WEEK(consultation_date) as week,
        YEAR(consultation_date) as year,
        SUM(cost) as income
       FROM consultations
       WHERE status = 'Completada' AND user_id = ? AND clinic_id = ? ${consultationDateCondition}
       GROUP BY WEEK(consultation_date), YEAR(consultation_date)
       ORDER BY year ASC, week ASC`, consultationParams);
        const mergedIncomeExpenseData = {};
        incomeExpenseData.forEach((row)=>{
            const key = `${row.year}-${row.week}`;
            mergedIncomeExpenseData[key] = {
                week: row.week,
                year: row.year,
                income: Number.parseFloat(row.income) || 0,
                expenses: Number.parseFloat(row.expenses) || 0
            };
        });
        consultationIncomeByWeek.forEach((row)=>{
            const key = `${row.year}-${row.week}`;
            if (mergedIncomeExpenseData[key]) {
                mergedIncomeExpenseData[key].income += Number.parseFloat(row.income) || 0;
            } else {
                mergedIncomeExpenseData[key] = {
                    week: row.week,
                    year: row.year,
                    income: Number.parseFloat(row.income) || 0,
                    expenses: 0
                };
            }
        });
        const appointments = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT c.*, p.name as patient_name, CONCAT(cl.first_name, ' ', cl.last_name) as owner_name, s.name as species_name
       FROM consultations c
       LEFT JOIN patients p ON c.patient_id = p.id
       LEFT JOIN clients cl ON p.client_id = cl.id
       LEFT JOIN species s ON p.species_id = s.id
       WHERE c.user_id = ? AND c.clinic_id = ? AND c.consultation_date >= NOW() 
       ORDER BY c.consultation_date ASC 
       LIMIT 5`, [
            userId,
            clinicId
        ]);
        const accountingRevenue = Number.parseFloat(revenueResult.total) || 0;
        const consultationRevenue = Number.parseFloat(consultationRevenueResult.total) || 0;
        const totalRevenue = accountingRevenue + consultationRevenue;
        const totalExpenses = Number.parseFloat(expensesResult.total) || 0;
        const responseData = {
            success: true,
            data: {
                metrics: {
                    totalRevenue,
                    totalExpenses,
                    netIncome: totalRevenue - totalExpenses,
                    scheduledAppointments: appointmentsResult.count || 0,
                    activePatients: patientsResult.count || 0
                },
                salesData: Object.keys(mergedSalesData).sort().map((date)=>({
                        date,
                        revenue: mergedSalesData[date]
                    })),
                incomeExpenseData: Object.values(mergedIncomeExpenseData).sort((a, b)=>{
                    if (a.year !== b.year) return a.year - b.year;
                    return a.week - b.week;
                }).slice(-8).map((row)=>({
                        week: `Semana ${row.week}`,
                        income: row.income,
                        expenses: row.expenses
                    })),
                appointments: appointments.map((apt)=>({
                        id: apt.id,
                        patientName: apt.patient_name,
                        ownerName: apt.owner_name,
                        species: apt.species_name,
                        reason: apt.reason,
                        date: apt.consultation_date,
                        status: apt.status
                    }))
            }
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responseData);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Error al obtener datos del dashboard",
            details: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__155307c1._.js.map