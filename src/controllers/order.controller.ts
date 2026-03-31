import { NextFunction, Response } from 'express'
import { getOrderByIdForRequester, listOrdersForUser, prepareOrderCheckout } from '../services/order.service'

export const orderCheckoutController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await prepareOrderCheckout(req.user._id)
    res.status(201).json({
      message: 'Order created — complete payment with the clientSecret on your frontend (Stripe.js)',
      order: result.order,
      clientSecret: result.clientSecret,
      publishableKey: result.publishableKey
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
