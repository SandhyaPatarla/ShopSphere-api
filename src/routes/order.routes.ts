import express from 'express'
import auth from '../middleware/auth.middleware'
import {
  getOrderByIdController,
  listOrdersController,
  orderCheckoutController
} from '../controllers/order.controller'

const router = express.Router()

router.post('/checkout', auth, orderCheckoutController)
router.get('/', auth, listOrdersController)
router.get('/:id', auth, getOrderByIdController)

export default router
