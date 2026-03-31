import mongoose from 'mongoose'
import { CartModel } from '../models/cart'
import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product'
import { getStripe } from '../config/stripe'

function cartLineQuantitySum(items: { quantity: number }[]): number {
  return items.reduce((s, i) => s + (i.quantity || 0), 0)
}

export async function rollbackCheckoutOrder(orderId: mongoose.Types.ObjectId): Promise<void> {
  const order = await OrderModel.findById(orderId)
  if (!order) return
  for (const item of order.items) {
    await ProductModel.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } }
    )
  }
  await OrderModel.deleteOne({ _id: orderId })
}

/** Validates cart, decrements stock, creates pending order, returns Stripe client secret. Cart is cleared after successful payment (webhook). */
export async function prepareOrderCheckout(userId: mongoose.Types.ObjectId) {
  const session = await mongoose.startSession()
  let createdOrderId: mongoose.Types.ObjectId | null = null

  try {
    session.startTransaction()

    const cart = await CartModel.findOne({ user: userId })
      .session(session)
      .populate('items.product')

    if (!cart || !cart.items.length || cartLineQuantitySum(cart.items) === 0) {
      throw new Error('Cart is empty')
    }

    const itemsPayload: { product: mongoose.Types.ObjectId; quantity: number; price: number }[] = []
    let totalPrice = 0

    for (const line of cart.items as unknown as { product: { _id: mongoose.Types.ObjectId; price: number; stock: number }; quantity: number }[]) {
      const product = line.product
      if (!product || !product._id) {
        throw new Error('Invalid product in cart')
      }
      if (product.stock < line.quantity) {
        throw new Error(`Insufficient stock for product ${product._id}`)
      }
      totalPrice += line.quantity * product.price
      itemsPayload.push({
        product: product._id,
        quantity: line.quantity,
        price: product.price
      })
    }

    for (const line of cart.items as unknown as { product: { _id: mongoose.Types.ObjectId }; quantity: number }[]) {
      const productId = line.product._id
      const res = await ProductModel.updateOne(
        { _id: productId, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } },
        { session }
      )
      if (res.modifiedCount !== 1) {
        throw new Error(`Could not reserve stock for product ${productId}`)
      }
    }

    const [order] = await OrderModel.create(
      [
        {
          user: userId,
          items: itemsPayload,
          totalPrice,
          status: 'pending' as const
        }
      ],
      { session }
    )

    createdOrderId = order._id as mongoose.Types.ObjectId
    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }

  const order = await OrderModel.findById(createdOrderId)
  if (!order) {
    throw new Error('Order was not persisted')
  }

  const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase()
  const amountCents = Math.round(order.totalPrice * 100)
  if (amountCents < 50) {
    await rollbackCheckoutOrder(order._id as mongoose.Types.ObjectId)
    throw new Error(
      'Order total is below the minimum charge amount for this currency (Stripe test: use at least $0.50 USD total)'
    )
  }

  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString()
      },
      automatic_payment_methods: { enabled: true }
    })

    await OrderModel.findByIdAndUpdate(order._id, {
      stripePaymentIntentId: paymentIntent.id
    })

    const updatedOrder = await OrderModel.findById(order._id).populate('items.product')

    return {
      order: updatedOrder,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
    }
  } catch (e) {
    await rollbackCheckoutOrder(order._id as mongoose.Types.ObjectId)
    throw e
  }
}

/** @deprecated Use prepareOrderCheckout — kept for clarity in docs */
export async function orderCheckout(userId: mongoose.Types.ObjectId) {
  return prepareOrderCheckout(userId)
}

export async function listOrdersForUser(userId: mongoose.Types.ObjectId) {
  return OrderModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product')
}

export async function getOrderByIdForRequester(
  orderId: string,
  userId: mongoose.Types.ObjectId,
  isAdmin: boolean
) {
  const filter: Record<string, unknown> = { _id: orderId }
  if (!isAdmin) {
    filter.user = userId
  }
  return OrderModel.findOne(filter).populate('items.product')
}
