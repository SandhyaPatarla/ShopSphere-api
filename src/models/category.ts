import  mongoose from 'mongoose';
import { Document } from 'mongoose'


interface ICategory extends Document{
    name:string;
    description?:string;
    isActive:Boolean;
    createdAt:Date;
    updatedAt:Date
}

const categorySchema= new mongoose.Schema<ICategory>({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

categorySchema.index({name:1},{unique:true})


export const CategoryModel= mongoose.model<ICategory>("Category",categorySchema)