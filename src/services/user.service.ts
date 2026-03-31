import { UserModel } from "../models/user"

export const getUser=async(id:any)=>{
    const user=await UserModel.findById(id)
    return user
}