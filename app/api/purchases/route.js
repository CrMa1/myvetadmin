import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { query } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId es requerido" }, { status: 400 })
    }

    const userQuery = `
      SELECT id_stripe_client 
      FROM users 
      WHERE id = ?
    `
    const [user] = await query(userQuery, [userId])

    if (!user || !user.id_stripe_client) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Usuario sin compras en Stripe",
      })
    }

    const sessions = await stripe.checkout.sessions.list({
      customer: user.id_stripe_client,
      limit: 100,
      expand: ["data.invoice", "data.subscription"],
    })

    const purchasesWithDetails = await Promise.all(
      sessions.data.map(async (session) => {
        // Obtener el nombre del plan desde la base de datos usando metadata.planId
        let planName = "Plan no especificado"
        if (session.metadata?.planId) {
          const planQuery = `SELECT name FROM subscription_plans WHERE id = ?`
          const [plan] = await query(planQuery, [session.metadata.planId])
          if (plan) {
            planName = plan.name
          }
        }

        // Mapear el método de pago desde payment_method_types
        const paymentMethod = session.payment_method_types?.[0] || "unknown"
        const paymentMethodMap = {
          card: "Tarjeta",
          link: "Link",
          paypal: "PayPal",
          unknown: "Desconocido",
        }

        // Crear enlace al recibo usando el invoice ID
        let receiptUrl = null
        if (session.invoice) {
          receiptUrl = typeof session.invoice === "string" ? session.invoice : session.invoice.hosted_invoice_url
        }

        // Mapear el estado del pago
        const statusMap = {
          paid: "Aprobado",
          unpaid: "Rechazado",
          no_payment_required: "Sin pago requerido",
        }

        return {
          id: session.id,
          amount: session.amount_total / 100, // Convertir de centavos
          currency: session.currency.toUpperCase(),
          status: session.payment_status,
          statusLabel: statusMap[session.payment_status] || "Desconocido",
          customer_email: session.customer_details?.email || "N/A",
          customer_name: session.customer_details?.name || "N/A",
          created: session.created * 1000, // Convertir a milisegundos
          payment_method: paymentMethodMap[paymentMethod] || "Desconocido",
          receipt_url: receiptUrl,
          plan_name: planName,
          invoice_id: session.invoice,
          subscription_id: session.subscription,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: purchasesWithDetails,
    })
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ success: false, error: "Error al obtener las compras" }, { status: 500 })
  }
}
