import { Document } from "mongoose";
import mongoose from "mongoose";

interface IProduct extends Document{
    name:string;
    description:string;
    price:number;
    stock:number;
    category:mongoose.Types.ObjectId;
    images:string[];
    isActive:boolean;
    reviews:mongoose.Types.ObjectId[];
    ratingsAverage:number;
    ratingsCount:number;
    createdBy:mongoose.Types.ObjectId
    createdAt:Date;
    updatedAt:Date
}

const productSchema= new mongoose.Schema<IProduct>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    images:{
            type:[String],
            required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review',
        required:true,
    }],
    ratingsAverage:{
        type:Number,
        min:0,
        default:0
    },
    ratingsCount:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})

productSchema.index({name:"text"})
productSchema.index({category:1})
productSchema.index({price:1})
productSchema.index({ratingsAverage:-1})
productSchema.index({category:1, price:1})

export const ProductModel=mongoose.model<IProduct>('Product',productSchema)