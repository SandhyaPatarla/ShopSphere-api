import { NextFunction, Request, Response } from "express";
import { createCategory, listCategories } from "../services/category.service";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await listCategories()
        res.status(200).json(result)
    }catch(error){
        next(error)
    }
}

export const create=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const result= await createCategory(req.body)
        res.status(201).json(result)
    }catch(error){
        next(error)
    }
}