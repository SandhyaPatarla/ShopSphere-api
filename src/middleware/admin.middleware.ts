import { NextFunction, Request } from "express";

export const isAdmin=(req:any,res:any,next:NextFunction)=>{
    if(req.user.role!=='admin'){
        res.status(403)
        throw new Error('Access Denied')
    }
    next()
}