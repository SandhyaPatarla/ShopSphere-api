import { Document, mongo } from "mongoose";
import mongoose from "mongoose";

interface IReview extends Document{
    user:mongoose.Types.ObjectId;
    product:mongoose.Types.ObjectId;
    rating:number;
    comment:string;
    isApproved:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const reviewSchema= new mongoose.Schema<IReview>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    isApproved: {
      type: Boolean,
      default: true
    }
},{
    timestamps:true
})

reviewSchema.index({user:1,product:1}, {unique:true})
reviewSchema.index({product:1})

export const ReviewModel=mongoose.model<IReview>('Review',reviewSchema)