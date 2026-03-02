import { Document } from "mongoose";
import mongoose from "mongoose";

interface IProduct extends Document{
    name:string;
    description:string;
    price:number;
    category:mongoose.Types.ObjectId;
    images:string[];
    isActive:boolean;
    ratingsAverage:number;
    ratingsCount:number;
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
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    images:[{
        image:{
            type:String,
            required:true
        }}
    ],
    isActive:{
        type:Boolean,
        default:true
    },
    ratingsAverage:{
        type:Number,
        min:0,
        default:0
    },
    ratingsCount:{
        type:Number,
        min:0,
        default:0
    }
},{
    timestamps:true
})