import express from 'express'
import {addToCartController,getCartController,updateCartController, deleteProductFromCart} from '../controllers/cart.controller'
import auth from '../middleware/auth.middleware'
const router=express.Router()

router.post("/",auth,addToCartController)
router.get("/",auth,getCartController)
router.put("/",auth,updateCartController)
router.delete("/:productId",auth,deleteProductFromCart)

export default router;