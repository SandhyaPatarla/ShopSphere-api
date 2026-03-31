import Stripe from 'stripe'
import { CartModel } from '../models/cart'
import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product'
import { getStripe, getStripeWebhookSecret } from '../config/stripe'

export async function handlePaymentIntentSucceeded(event: Stripe.PaymentIntentSucceededEvent): Promise<void> {
  const pi = event.data.object
  const orderId = pi.metadata?.orderId
  if (!orderId) return

  const updated = await OrderModel.findOneAndUpdate(
    { _id: orderId, status: 'pending' },
    { status: 'paid', stripePaymentIntentId: pi.id },
    { new: true }
  )

  if (!updated) return

  await CartModel.findOneAndUpdate({ user: updated.user }, { $set: { items: [] } })
}

async function releaseOrderStockAndDelete(
  pi: Stripe.PaymentIntent
): Promise<void> {
  const orderId = pi.metadata?.orderId
  if (!orderId) return

  const order = await OrderModel.findOne({
    _id: orderId,
    status: 'pending',
    stripePaymentIntentId: pi.id
  })

  if (!order) return

  for (const item of order.items) {
    await ProductModel.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } }
    )
  }

  await OrderModel.deleteOne({ _id: order._id })
}

export async function processStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event as Stripe.PaymentIntentSucceededEvent)
      break
    case 'payment_intent.payment_failed':
    case 'payment_intent.canceled':
      await releaseOrderStockAndDelete((event as Stripe.PaymentIntentPaymentFailedEvent).data.object)
      break
    default:
      break
  }
}

export function constructStripeWebhookEvent(
  rawBody: Buffer | string,
  signature: string | string[] | undefined
): Stripe.Event {
  const stripe = getStripe()
  const secret = getStripeWebhookSecret()
  if (!signature || typeof signature !== 'string') {
    throw new Error('Missing stripe-signature header')
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret)
}
