import express from 'express'
import auth from '../middleware/auth.middleware'
import { create, deleteById, getAll, getById, updateById } from '../controllers/product.controller'
import { isAdmin } from '../middleware/admin.middleware'
const router=express.Router()

router.post('/product',auth,isAdmin,create)
router.get('/product',auth,getAll)
router.get('/product/:id',auth,getById)
router.put('/product/:id',auth,isAdmin,updateById)
router.delete('/product/:id',auth,isAdmin,deleteById)

export default router