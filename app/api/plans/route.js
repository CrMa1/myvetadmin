import { NextResponse } from "next/server"
import { Stripe } from "stripe"
import { query } from "@/lib/db-landing"

export async function GET() {
  try {
    console.log("[v0] Fetching subscription plans from database")

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const prices = await stripe.prices.list();
    console.log('Precios planes', prices)

    const plans = await query(
      `SELECT * FROM subscription_plans 
       WHERE is_active = TRUE 
       ORDER BY display_order ASC, price_monthly ASC`,
      [],
    )

    console.log("[v0] Plans found:", plans.length)

    // Parse JSON features
    const parsedPlans = plans.map((plan) => ({
      ...plan,
      features: typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features,
    }))

    return NextResponse.json({ plans: parsedPlans })
  } catch (error) {
    console.error("[v0] Error fetching plans:", error)
    return NextResponse.json({ error: "Error al cargar planes", plans: [] }, { status: 500 })
  }
}
