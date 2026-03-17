import { NextFunction, Request, Response } from "express";
import {createProduct, deleteProductById, getAllProducts, getProductById, updateProductById} from '../services/product.service'
import { Query } from "mongoose";


export const create=async(req:any,res:Response,next:NextFunction)=>{
    try{
       const result= await createProduct(req.body, req.user._id)
       res.status(201).json(result)
    }catch(error){
        next(error)
    }
}


export const getAll= async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const result= await getAllProducts(req.query)
       res.status(200).json(result)
    }catch(error){
        next(error)
    }
}

export const getById= async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const result= await getProductById(req.params.id.toString())
       res.status(200).json(result)
    }catch(error){
        next(error)
    }
}

export const updateById= async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const result= await updateProductById(req.params.id.toString(),req.body)
       res.json(result)
    }catch(error){
        next(error)
    }
}

export const deleteById= async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const result= await deleteProductById(req.params.id.toString())
       res.json({message:"deleted successfully"})
    }catch(error){
        next(error)
    }
}