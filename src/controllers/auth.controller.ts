import { Request,Response ,NextFunction} from "express";
import {signupUser, loginUser} from '../services/auth.service'

export const signup= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await signupUser(req.body)
        res.status(201).json(result)
    }catch(error){
        next(error)
    }
}

export const login= async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const result=await loginUser(req.body,res)
        res.status(200).json(result)
    }catch(error){
        next(error)
    }
}