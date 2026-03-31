import express from 'express'
import { stripeWebhookController } from '../controllers/stripe.webhook.controller'

const router = express.Router()

router.post('/', stripeWebhookController)

export default router
