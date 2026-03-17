import express from 'express'
import {create} from '../controllers/category.controller'
import auth from '../middleware/auth.middleware'
import { isAdmin } from '../middleware/admin.middleware'
const router= express.Router()

router.post('/category',auth,isAdmin,create)

export default router