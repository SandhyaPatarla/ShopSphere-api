import express from 'express'
import { razorpayWebhookController } from '../controllers/razorpay.webhook.controller'

const router = express.Router()

router.post('/', razorpayWebhookController)

export default router
