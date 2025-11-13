import mysql from "mysql2/promise"


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
  keepAliveInitialDelay: 0,
}

// Pool de conexiones para mejor rendimiento
let pool

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function query(sql, params) {
  //console.log("[v0] Query params:", params)
  
  const connection = await getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    //console.log("[v0] Query successful, rows returned:", Array.isArray(results) ? results.length : "single result")
    return results
  } catch (error) {
    //console.error("[v0] Database query error - Full details:")
    //console.error("[v0] Query:", sql)
    //console.error("[v0] Params:", params)
    //console.error("[v0] Error message:", error.message)
    //console.error("[v0] Error code:", error.code)
    //console.error("[v0] Error sqlState:", error.sqlState)
    //console.error("[v0] Error:", error)
    throw error
  }
}

export default { getConnection, query }
