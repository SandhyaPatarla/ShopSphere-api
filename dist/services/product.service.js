"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
// export const createProduct=async(data:any, id:any)=>{
//    return await ProductModel.create({...data,createdBy:id})
// }
// export const getAllProducts= async(query:any)=>{
//     let page= query.page || 1
//     let limit= query.limit || 10
//     let skip=(page-1)*limit
//     let filter:any={}
//     if(query.category){
//         filter.category=query.category
//     }
//     if(query.maxLimit || query.minLimit){
//         filter.price={}
//         if(query.maxLimit) filter.price.$lte=query.maxLimit
//         if(query.minLimit) filter.price.$gte=query.minLimit
//     }
//     if(query.search){
//         filter.name={$regex:query.search, $options:'i'}
//     }
//     const products= await ProductModel.find(filter).populate('category').skip(skip).limit(limit)
//     const total= await ProductModel.countDocuments(filter)
//     return {
//         products,
//         total,
//         page,
//         limit,
//         pages:Math.ceil(total/limit)
//     }
// }
// export const getProductById=async(id:string)=>{
//     return await ProductModel.findById(id).populate('category').populate({path:'reviews',populate:{path:'user',select:'name email'}})
// }
// export const updateProductById= async(id:string, data:any)=>{
//     return await ProductModel.findByIdAndUpdate(id,data,{new: true})
// }
// export const deleteProductById= async(id:string)=>{
//     return await ProductModel.findByIdAndDelete(id)
// }
const createProduct = async (data, id) => {
    return await product_1.ProductModel.create({ ...data, createdBy: id });
};
exports.createProduct = createProduct;
const getAllProducts = async (query) => {
    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 10;
    let skip = (page - 1) * limit;
    let filter = {};
    if (query.category) {
        filter.category = query.category;
    }
    if (query.maxLimit || query.minLimit) {
        filter.price = {};
        if (query.maxLimit)
            filter.price.$lte = query.maxLimit;
        if (query.minLimit)
            filter.price.$gte = query.minLimit;
    }
    if (query.search) {
        filter.name = { $regex: query.search, $options: 'i' };
    }
    const products = await product_1.ProductModel.find(filter).populate('category').skip(skip).limit(limit);
    const total = await product_1.ProductModel.countDocuments(filter);
    return {
        products,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    };
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return await product_1.ProductModel.findById(id).populate("category").populate({ path: 'reviews', populate: { path: 'user', select: "name email" } });
};
exports.getProductById = getProductById;
const updateProductById = async (id, data) => {
    return await product_1.ProductModel.findByIdAndUpdate(id, data, { new: true });
};
exports.updateProductById = updateProductById;
const deleteProductById = async (id) => {
    return await product_1.ProductModel.findByIdAndDelete(id);
};
exports.deleteProductById = deleteProductById;
