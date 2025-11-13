import mysql from "mysql2/promise"

let pool

export function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
        host: process.env.DB_HOST || "174.136.31.150",
        user: process.env.DB_USER || "mavishop_myvetadmin",
        password: process.env.DB_PASSWORD || "KDZ-2y_O#cmI^v7r",
        database: process.env.DB_NAME || "mavishop_myvetadmin",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })
  }
  return pool
}

export async function query(sql, params) {
  const connection = getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}
