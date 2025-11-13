// Stripe configuration
// This file handles Stripe initialization and configuration

export function getStripePublishableKey() {
  // Try to get the key from environment variables
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!key) {
    console.error("[v0] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured")
    console.error("[v0] Please ensure the Stripe integration is properly set up in your Vercel project")
    return null
  }

  console.log("[v0] Stripe publishable key found:", key.substring(0, 20) + "...")
  return key
}

export function validateStripeConfig() {
  const key = getStripePublishableKey()
  if (!key) {
    throw new Error("Stripe no está configurado correctamente. Por favor contacta con el soporte técnico.")
  }
  return key
}
