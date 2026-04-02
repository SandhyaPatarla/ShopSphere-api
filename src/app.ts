import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import productRouter from './routes/product.routes'
import categoryRouter from './routes/category.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'
import reviewRoutes from './routes/review.routes'
import razorpayWebhookRoutes from './routes/razorpay.webhook.routes'
import auth from './middleware/auth.middleware'
import { orderCheckoutController } from './controllers/order.controller'
import { errorHandler } from './middleware/error.middleware'

const app = express()

app.use(cors())
app.use(helmet())

app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), razorpayWebhookRoutes)

app.use(express.json())

app.use(authRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
/** @deprecated Prefer POST /api/orders/checkout */
app.post('/orderCheckout', auth, orderCheckoutController)

app.use(errorHandler)

export default app
