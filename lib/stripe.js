import "server-only"
import Stripe from "stripe"



export const stripe = new Stripe('sk_test_51ST2k31LGdPqIkO07Wo8u3cWoOY3beZ9nUqw9evn8i0rSYD386ShNh4Rl47BooLD4b0uTfcKPeoMCxENp8AHtO1b00NAw4aqbR', {
  apiVersion: "2024-11-20.acacia",
})
