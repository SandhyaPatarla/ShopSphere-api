import express from "express"
import auth from "../middleware/auth.middleware"
import { orderCheckoutController } from "../controllers/order.controller"

const router=express.Router()

router.post('/orderCheckout',auth,orderCheckoutController)

export default router