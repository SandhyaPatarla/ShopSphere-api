import { NextFunction, Request, Response } from "express";
import { createCategory } from "../services/category.service";

export const create=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const result= await createCategory(req.body)
        res.status(201).json(result)
    }catch(error){
        next(error)
    }
}