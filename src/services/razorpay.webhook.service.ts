import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product'
import { markOrderPaidAfterCapture } from './razorpay-order-completion.service'

type PaymentEntity = {
  id?: string
  order_id?: string
  status?: string
}

type RazorpayWebhookBody = {
  event?: string
  payload?: {
    payment?: {
      entity?: PaymentEntity
    }
  }
}

export async function processRazorpayWebhookEvent(body: RazorpayWebhookBody): Promise<void> {
  const event = body.event
  const entity = body.payload?.payment?.entity
  if (!event || !entity?.order_id) return

  const razorpayOrderId = entity.order_id
  const paymentId = entity.id

  switch (event) {
    case 'payment.captured':
      await markOrderPaidAfterCapture(razorpayOrderId, paymentId)
      break
    case 'payment.failed':
      await handlePaymentFailed(razorpayOrderId)
      break
    default:
      break
  }
}

async function handlePaymentFailed(razorpayOrderId: string): Promise<void> {
  const order = await OrderModel.findOne({
    razorpayOrderId,
    status: 'pending'
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
