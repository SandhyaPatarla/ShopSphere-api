import { Request, Response } from 'express'
import { constructStripeWebhookEvent, processStripeWebhookEvent } from '../services/stripe.webhook.service'

export async function stripeWebhookController(req: Request, res: Response): Promise<void> {
  try {
    const signature = req.headers['stripe-signature']
    const event = constructStripeWebhookEvent(req.body, signature)
    await processStripeWebhookEvent(event)
    res.status(200).json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook handler error'
    res.status(400).send(`Webhook Error: ${message}`)
  }
}
