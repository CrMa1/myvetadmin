import { NextResponse } from "next/server"
import { query, getConnection } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clinicId = searchParams.get("clinicId")

    if (!userId || !clinicId) {
      return NextResponse.json({ success: false, error: "userId y clinicId son requeridos" }, { status: 400 })
    }

    const sales = await query(
      `SELECT s.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', si.inventory_id, 'name', si.item_name, 'quantity', si.quantity, 'price', si.unit_price, 'subtotal', si.subtotal)
        ) FROM sale_items si WHERE si.sale_id = s.id) as items
       FROM sales s
       WHERE s.user_id = ? AND s.clinic_id = ?
       ORDER BY s.sale_date DESC`,
      [userId, clinicId],
    )

    const salesWithItems = sales.map((sale) => ({
      ...sale,
      items: sale.items ? JSON.parse(sale.items) : [],
    }))

    return NextResponse.json({ success: true, data: salesWithItems })
  } catch (error) {
    console.error("Get sales error:", error)
    return NextResponse.json({ success: false, error: "Error al obtener ventas" }, { status: 500 })
  }
}

export async function POST(request) {
  let connection

  try {
    const body = await request.json()

    if (!body.userId || !body.clinicId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId y clinicId son requeridos",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "La venta debe tener al menos un artículo",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    connection = await getConnection()
    connection = await connection.getConnection()
    await connection.beginTransaction()

    const saleNumber = `VTA-${new Date().getFullYear()}-${Date.now()}`

    const subtotal = Number.parseFloat(body.subtotal) || 0
    const tax = Number.parseFloat(body.tax) || 0
    const discount = Number.parseFloat(body.discount) || 0
    const total = Number.parseFloat(body.total) || 0
    const amountPaid = Number.parseFloat(body.amountPaid) || total
    const change = Number.parseFloat(body.change) || 0

    const [saleResult] = await connection.execute(
      `INSERT INTO sales (user_id, clinic_id, sale_number, customer_name, subtotal, tax, discount, total, payment_method, amount_paid, change_amount, notes, cashier, sale_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        Number.parseInt(body.userId),
        Number.parseInt(body.clinicId),
        saleNumber,
        body.customer || "Cliente general",
        subtotal,
        tax,
        discount,
        total,
        body.paymentMethod || "Efectivo",
        amountPaid,
        change,
        body.notes || null,
        body.cashier || "Cajero",
      ],
    )

    const saleId = saleResult.insertId

    const saleItems = []

    for (const item of body.items) {

      const itemPrice = Number.parseFloat(item.price) || 0
      const itemQuantity = Number.parseInt(item.quantity) || 1
      const itemSubtotal = itemPrice * itemQuantity

      await connection.execute(
        `INSERT INTO sale_items (sale_id, inventory_id, item_name, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [saleId, Number.parseInt(item.id), item.name, itemQuantity, itemPrice, itemSubtotal],
      )

      saleItems.push({
        id: Number.parseInt(item.id),
        name: item.name,
        quantity: itemQuantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      })

      await connection.execute(
        "UPDATE inventory SET stock = stock - ? WHERE id = ? AND user_id = ? AND clinic_id = ?",
        [itemQuantity, Number.parseInt(item.id), Number.parseInt(body.userId), Number.parseInt(body.clinicId)],
      )
    }

    await connection.execute(
      `INSERT INTO accounting (user_id, clinic_id, type, category_id, amount, description, transaction_date, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [
        Number.parseInt(body.userId),
        Number.parseInt(body.clinicId),
        "Ingreso",
        1,
        total,
        `Venta ${saleNumber}`,
        body.paymentMethod || "Efectivo",
      ],
    )

    await connection.commit()

    const saleData = {
      id: saleId,
      saleNumber: saleNumber,
      customerName: body.customer || "Cliente general",
      subtotal: subtotal,
      tax: tax,
      discount: discount,
      total: total,
      paymentMethod: body.paymentMethod || "Efectivo",
      amountPaid: amountPaid,
      changeAmount: change,
      cashier: body.cashier || "Cajero",
      saleDate: new Date().toISOString(),
      items: saleItems,
    }

    return NextResponse.json(
      {
        success: true,
        data: saleData,
        message: "Venta procesada exitosamente",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al procesar venta",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } finally {
    if (connection) {
      try {
        connection.release()
      } catch (releaseError) {
        console.error("[v0] Connection release error:", releaseError)
      }
    }
  }
}
