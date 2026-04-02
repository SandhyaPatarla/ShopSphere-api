import mongoose from 'mongoose'
import { CartModel } from '../models/cart'
import { OrderModel } from '../models/order'
import { ProductModel } from '../models/product'
import { getShopCurrency } from '../config/shop'
import { getRazorpay, getRazorpayKeySecret } from '../config/razorpay'
import { markOrderPaidAfterCapture } from './razorpay-order-completion.service'
import { validatePaymentVerification } from '../utils/razorpay-payment-verify'

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

/** Validates cart, decrements stock, creates pending order, creates Razorpay order. Cart is cleared after successful payment (webhook or POST /verify-payment). */
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
          currency: getShopCurrency(),
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

  const currency = getShopCurrency()
  const amountPaise = Math.round(order.totalPrice * 100)
  if (amountPaise < 100) {
    await rollbackCheckoutOrder(order._id as mongoose.Types.ObjectId)
    throw new Error('Order total must be at least ₹1 INR (100 paise) for Razorpay')
  }

  try {
    const rzp = getRazorpay()
    const receipt = `rcp_${order._id.toString()}`.slice(0, 40)
    const rzpOrder = await rzp.orders.create({
      amount: amountPaise,
      currency,
      receipt,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString()
      }
    })

    await OrderModel.findByIdAndUpdate(order._id, {
      razorpayOrderId: rzpOrder.id
    })

    const updatedOrder = await OrderModel.findById(order._id).populate('items.product')

    return {
      order: updatedOrder,
      razorpayOrderId: rzpOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID || '',
      amount: amountPaise,
      currency
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

export type RazorpayVerifyPaymentBody = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

/**
 * Verifies Checkout success using Razorpay signature (HMAC with Key Secret) and API payment status,
 * then marks the order paid. Use when webhooks are not configured (e.g. local demo).
 */
export async function verifyRazorpayPaymentAndCompleteOrder(
  userId: mongoose.Types.ObjectId,
  body: RazorpayVerifyPaymentBody
) {
  const keySecret = getRazorpayKeySecret()

  const valid = validatePaymentVerification(
    {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id
    },
    body.razorpay_signature,
    keySecret
  )

  if (!valid) {
    throw new Error('Invalid Razorpay payment signature')
  }

  const rzp = getRazorpay()
  const payment = await rzp.payments.fetch(body.razorpay_payment_id)

  if (payment.order_id != null && payment.order_id !== body.razorpay_order_id) {
    throw new Error('Payment does not match this order')
  }

  const status = payment.status
  if (status !== 'captured' && status !== 'authorized') {
    throw new Error(`Payment not successful (status: ${status ?? 'unknown'})`)
  }

  const order = await OrderModel.findOne({
    user: userId,
    razorpayOrderId: body.razorpay_order_id
  })

  if (!order) {
    throw new Error('Order not found or does not belong to this user')
  }

  if (order.status === 'paid') {
    return OrderModel.findById(order._id).populate('items.product')
  }

  if (order.status !== 'pending') {
    throw new Error('Order cannot be paid in its current state')
  }

  const result = await markOrderPaidAfterCapture(body.razorpay_order_id, body.razorpay_payment_id)

  if (result.updated) {
    return OrderModel.findById(result.orderId).populate('items.product')
  }

  if (result.orderId) {
    return OrderModel.findById(result.orderId).populate('items.product')
  }

  throw new Error('Could not complete order')
}
