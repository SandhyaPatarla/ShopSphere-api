import { NextFunction, Request, Response } from "express";
import {addToCart,getCart,updateCart,removeItem} from "../services/cart.service"

export const addToCartController=async(req:any,res:any,next:NextFunction)=>{
    try{
        let result= await addToCart(req.user._id,req.body.productId,req.body.quantity);
        res.status(201).json({result})
    }catch(e){
        next(e)
    }
}

export const getCartController= async(req:any,res:any,next:NextFunction)=>{
    try{
        let result=await getCart(req.user._id);
        res.status(200).json({result})
       
    }catch(e){
        next(e)
    }
}

export const updateCartController=async(req:any,res:any,next:NextFunction)=>{
    try{
        let result=await updateCart(req.user._id,req.body.productId,req.body.quantity)
        res.status(200).json({result})
    }catch(e){
        next(e)
    }
}

export const deleteProductFromCart= async(req:any,res:any,next:NextFunction)=>{
    try{
        let result=await removeItem(req.user._id,req.params.productId)
        res.status(200).json({result})
    }catch(e){
        next(e)
    }
}