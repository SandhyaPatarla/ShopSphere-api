import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
console.log(process.env.MONGODBURL?.toString())

export const db=mongoose.connect(process.env.MONGODBURL?.toString()|| '')