import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(request) {
  try {
    const authResult = await verifyAuth(request)
    console.log("[v0] Upgrading plan for request:", authResult)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = authResult.user.id
    const newPlanId = authResult.newPlanId

    if (!newPlanId) {
      return NextResponse.json({ error: "Plan no especificado" }, { status: 400 })
    }

    // Get user's Stripe customer ID
    const [user] = await query(`SELECT id_stripe_client, plan_id FROM users WHERE id = ?`, [userId])

    if (!user || !user.id_stripe_client) {
      return NextResponse.json(
        {
          error: "Cliente de Stripe no encontrado. Por favor contacte soporte.",
        },
        { status: 404 },
      )
    }

    // Get new plan details
    const [newPlan] = await query(`SELECT * FROM subscription_plans WHERE id = ?`, [newPlanId])

    if (!newPlan || !newPlan.stripe_id) {
      return NextResponse.json({ error: "Plan no válido" }, { status: 404 })
    }

    // Verify new plan is higher than current plan
    const [currentPlan] = await query(`SELECT display_order, price_monthly FROM subscription_plans WHERE id = ?`, [
      user.plan_id,
    ])

    if (currentPlan && newPlan.display_order <= currentPlan.display_order) {
      return NextResponse.json(
        {
          error: "Solo puedes actualizar a un plan superior",
        },
        { status: 400 },
      )
    }

    // Get customer's current subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.id_stripe_client,
      status: "active",
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        {
          error: "No se encontró suscripción activa en Stripe",
        },
        { status: 404 },
      )
    }

    const subscription = subscriptions.data[0]
    const currentSubscriptionItem = subscription.items.data[0]

    // Update subscription with new plan
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: currentSubscriptionItem.id,
          price: newPlan.stripe_id,
        },
      ],
      proration_behavior: "create_prorations", // Pro-rate the charges
    })

    // Update user's plan in database
    await query(`UPDATE users SET plan_id = ?, updated_at = NOW() WHERE id = ?`, [newPlanId, userId])

    // Get next billing date and amount
    const nextBillingDate = new Date(updatedSubscription.current_period_end * 1000)
    const amount = updatedSubscription.items.data[0].price.unit_amount / 100

    return NextResponse.json({
      success: true,
      subscription: {
        nextBillingDate: nextBillingDate.toISOString(),
        amount: amount,
        currency: updatedSubscription.currency.toUpperCase(),
        planName: newPlan.name,
      },
    })
  } catch (error) {
    console.error("[v0] Error upgrading plan:", error)

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        {
          error: "Error con el método de pago. Por favor actualiza tu tarjeta.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: error.message || "Error al actualizar el plan. Por favor intenta nuevamente.",
      },
      { status: 500 },
    )
  }
}
