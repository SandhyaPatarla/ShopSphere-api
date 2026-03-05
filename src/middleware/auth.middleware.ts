import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UserModel } from "../models/user";
dotenv.config()

interface JwtPayload{
    _id:string
}

const auth=async (req:Request,res:Response,next:NextFunction)=>{
    try{
    const authHeader= req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ") ){
        res.status(401)
        throw new Error("Not authorized, no token")
    }
    const bearerToken= authHeader.replace("Bearer ","")
    const decoded= jwt.verify(bearerToken,process.env.JWT_SECRET as string) as JwtPayload
    const user= await UserModel.findById(decoded._id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    (req as any).user = user
    next()
}catch(error){
    next(error)
}
}

export default auth