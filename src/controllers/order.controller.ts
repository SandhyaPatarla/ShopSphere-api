import { NextFunction, Response } from "express";
import { orderCheckout } from "../services/order.service";


export const orderCheckoutController=async(req:any,res:Response,next:NextFunction)=>{
    try{
        const result=await orderCheckout(req.user._id)
        res.status(201).json({message:"order placed Successfully",result})
    }catch(e){
        next(e)
    }
}