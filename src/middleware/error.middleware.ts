import { Request, Response,NextFunction } from "express"

export const errorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    
    res.status(res.statusCode).json({
        errorMessage:err.message || "Server Error"   
    
    })

}