import { NextFunction, Response } from 'express'
import {
  getOrderByIdForRequester,
  listOrdersForUser,
  prepareOrderCheckout,
  verifyRazorpayPaymentAndCompleteOrder
} from '../services/order.service'

export const orderCheckoutController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await prepareOrderCheckout(req.user._id)
    res.status(201).json({
      message:
        'Order created — pay in INR (₹). Open Razorpay Checkout with keyId, razorpayOrderId, amount in paise (100 paise = ₹1), and currency',
      order: result.order,
      razorpayOrderId: result.razorpayOrderId,
      keyId: result.keyId,
      amount: result.amount,
      currency: result.currency
    })
  } catch (e) {
    next(e)
  }
}

export const listOrdersController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const orders = await listOrdersForUser(req.user._id)
    res.status(200).json(orders)
  } catch (e) {
    next(e)
  }
}

export const verifyRazorpayPaymentController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400)
      throw new Error('razorpay_order_id, razorpay_payment_id, and razorpay_signature are required')
    }
    const order = await verifyRazorpayPaymentAndCompleteOrder(req.user._id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })
    res.status(200).json({ message: 'Payment verified', order })
  } catch (e) {
    next(e)
  }
}

export const getOrderByIdController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const order = await getOrderByIdForRequester(req.params.id, req.user._id, isAdmin)
    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }
    res.status(200).json(order)
  } catch (e) {
    next(e)
  }
}
