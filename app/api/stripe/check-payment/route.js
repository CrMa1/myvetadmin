import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request) {
  try {
    const { sessionId } = await request.json()

    console.log("[v0] Checking payment status for session:", sessionId)

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log("[v0] Session status:", session.status)
    console.log("[v0] Payment status:", session.payment_status)

    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
    })
  } catch (error) {
    console.error("[v0] Error checking payment status:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
