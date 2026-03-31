import { CategoryModel } from "../models/category"

export const createCategory=async(data:any)=>{
    return await CategoryModel.create(data)
}

export const listCategories = async () => {
    return CategoryModel.find({ isActive: true }).sort({ name: 1 })
}