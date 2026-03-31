import Stripe from 'stripe'

let stripeSingleton: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeSingleton
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }
  return secret
}
