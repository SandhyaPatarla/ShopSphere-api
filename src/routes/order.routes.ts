import express from 'express'
import auth from '../middleware/auth.middleware'
import {
  getOrderByIdController,
  listOrdersController,
  orderCheckoutController,
  verifyRazorpayPaymentController
} from '../controllers/order.controller'

const router = express.Router()

router.post('/checkout', auth, orderCheckoutController)
router.post('/verify-payment', auth, verifyRazorpayPaymentController)
router.get('/', auth, listOrdersController)
router.get('/:id', auth, getOrderByIdController)

export default router
