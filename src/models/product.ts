import { Document } from "mongoose";
import mongoose from "mongoose";

interface IProduct extends Document{
    name:string;
    description:string;
    /** Unit price in INR (Indian Rupees), not USD */
    price:number;
    /** ISO 4217; shop uses INR only (may be absent on legacy documents) */
    currency?: string;
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
    currency:{
        type:String,
        default:'INR',
        enum:['INR']
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
        ref:'Review'
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