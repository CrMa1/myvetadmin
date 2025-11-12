import { NextResponse } from "next/server"

export async function POST() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al cerrar sesión" }, { status: 500 })
  }
}
