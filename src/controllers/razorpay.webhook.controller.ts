import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import { getRazorpayWebhookSecret } from '../config/razorpay'
import { processRazorpayWebhookEvent } from '../services/razorpay.webhook.service'

export async function razorpayWebhookController(req: Request, res: Response): Promise<void> {
  try {
    const sigHeader = req.headers['x-razorpay-signature']
    const signature = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body ?? '')
    const secret = getRazorpayWebhookSecret()

    if (!signature) {
      res.status(400).send('Missing x-razorpay-signature')
      return
    }

    const valid = Razorpay.validateWebhookSignature(rawBody, signature, secret)
    if (!valid) {
      res.status(400).send('Invalid webhook signature')
      return
    }

    const body = JSON.parse(rawBody) as Parameters<typeof processRazorpayWebhookEvent>[0]
    await processRazorpayWebhookEvent(body)
    res.status(200).json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook handler error'
    res.status(400).send(`Webhook Error: ${message}`)
  }
}
