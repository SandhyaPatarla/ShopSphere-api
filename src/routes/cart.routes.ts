import express from 'express'
import {addToCartController,getCartController,updateCartController, deleteProductFromCart} from '../controllers/cart.controller'
const router=express.Router()

router.post("/",addToCartController)
router.get("/",getCartController)
router.put("/",updateCartController)
router.delete("/:productId",deleteProductFromCart)

export default router;