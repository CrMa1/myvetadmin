// Script para generar hash de contraseñas con bcrypt
// Ejecutar con: node scripts/generate-password.js

const bcrypt = require("bcryptjs")

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10)
  console.log(`Password: ${password}`)
  console.log(`Hash: ${hash}`)
  console.log("---")
}

// Generar hash para la contraseña de prueba
generateHash("admin123")
