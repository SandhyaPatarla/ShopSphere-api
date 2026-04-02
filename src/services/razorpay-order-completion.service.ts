import { CartModel } from '../models/cart'
import { OrderModel } from '../models/order'

/**
 * Marks a pending order paid and clears the user's cart. Idempotent if already paid.
 * Used by webhook (payment.captured) and by POST /verify-payment after Checkout success.
 */
export async function markOrderPaidAfterCapture(
  razorpayOrderId: string,
  razorpayPaymentId: string | undefined
): Promise<{ updated: boolean; orderId?: string }> {
  const update: { status: 'paid'; razorpayPaymentId?: string } = { status: 'paid' }
  if (razorpayPaymentId) {
    update.razorpayPaymentId = razorpayPaymentId
  }

  const updated = await OrderModel.findOneAndUpdate(
    { razorpayOrderId, status: 'pending' },
    update,
    { new: true }
  )

  if (!updated) {
    const alreadyPaid = await OrderModel.findOne({ razorpayOrderId, status: 'paid' })
    if (alreadyPaid) {
      return { updated: false, orderId: alreadyPaid._id.toString() }
    }
    return { updated: false }
  }

  await CartModel.findOneAndUpdate({ user: updated.user }, { $set: { items: [] } })
  return { updated: true, orderId: updated._id.toString() }
}
