import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { getUser } from "../services/user.service";

export const handleGetUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{

       const result=await getUser(req.params.id)
       res.json({result})
    }catch(e){
        next(e)
    }
}