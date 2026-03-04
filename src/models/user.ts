import {Document } from 'mongoose'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

export type UserRole= "user" | "admin"

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:UserRole;
    createdAt:Date;
    updatedAt:Date
}

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        maxLength:7
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},
   {
    timestamps:true
   }
)

userSchema.index({email:1},{unique:true})

userSchema.pre('save',async function (this:IUser) {
    let user=this
    if(this.isModified("password")){
       user.password=await bcrypt.hash(this.password,10)
    }
    
})


export const UserModel= mongoose.model<IUser>('User',userSchema)
