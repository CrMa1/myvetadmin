import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getProductById } from "@/lib/products"

export async function POST(request) {
  try {
    const { productId, userData } = await request.json()

    console.log("[v0] Creating checkout session for product:", productId)
    console.log("[v0] User data TODO:", userData)
    console.log("[v0] User data:", { email: userData.email, name: userData.firstName })

    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: userData.email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
      console.log("[v0] Existing customer found:", customer.id)
    } else {
      console.log("[v0] New customer creating:", userData)
      customer = await stripe.customers.create({
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone,
        metadata: {
          userId: userData.userId || "pending",
        },
      })
      console.log("[v0] New customer created:", customer.id)
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: product.billingCycle === "yearly" ? { interval: "year" } : { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        productId: product.id,
        planId: product.planId.toString(),
        billingCycle: product.billingCycle,
        userId: userData.userId || "pending",
      },
    })

    console.log("[v0] Checkout session created:", session.id)

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    return NextResponse.json({ error: "Error al crear sesión de pago" }, { status: 500 })
  }
}
