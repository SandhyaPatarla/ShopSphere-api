import { ProductModel } from "../models/product"

export const createProduct=async(data:any)=>{
   return await ProductModel.create(data)
}

export const getAllProducts= async(query:any)=>{
    let page=query.page || 1
    let limit= query.limit || 10
    let skip = (page-1)* limit
    let filter:any={}
    if(query.category){
        filter.category=query.category
    }
    if(query.minPrice || query.maxPrice){
        filter.price={}
        if(query.minPrice) filter.price.$gte=query.minPrice
        if(query.maxPrice) filter.price.$lte=query.maxPrice
    }
    if(query.search){
        filter.name= {$regex:query.search, $options:'i'}
    }

    const products= await ProductModel.find(filter).populate("Category").skip(skip).limit(limit)
    const total = await ProductModel.countDocuments(filter)
    return {
        products,
        total,
        page,
        pages:Math.ceil(total/limit)
    }
}