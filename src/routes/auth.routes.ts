import express from "express";
import { signup, login } from "../controllers/auth.controller";
import { handleGetUser } from "../controllers/getUser";
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/getUser",handleGetUser)

export default router