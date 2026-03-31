import express from 'express'
import {create, getAll} from '../controllers/category.controller'
import auth from '../middleware/auth.middleware'
import { isAdmin } from '../middleware/admin.middleware'
const router= express.Router()

router.get('/category', getAll)
router.post('/category',auth,isAdmin,create)

export default router