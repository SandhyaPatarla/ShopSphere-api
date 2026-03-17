import { CategoryModel } from "../models/category"

export const createCategory=async(data:any)=>{
    return await CategoryModel.create(data)
}