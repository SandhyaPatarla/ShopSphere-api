import express from 'express'
import auth from '../middleware/auth.middleware'
import { createReviewController, listReviewsController } from '../controllers/review.controller'

const router = express.Router()

router.get('/product/:productId', listReviewsController)
router.post('/', auth, createReviewController)

export default router
