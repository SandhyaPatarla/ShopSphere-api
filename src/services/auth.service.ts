import { Response } from 'express';
import {UserModel} from '../models/user'
import { generateToken } from '../utils/generateToken';
import bcrypt from 'bcryptjs'

interface SignupInput{
    name:string;
    email:string;
    password:string
}

interface LoginInput{
    email:string;
    password:string
}

export const signupUser= async(data:SignupInput)=>{
    const {name,email,password}=data
    const existingUser= await UserModel.findOne({email})
    if(existingUser) throw new Error("user already exists")
    const user=await UserModel.create({
        name,
        email,
        password
    })

    const token= generateToken(user._id.toString())
    return({
        _id:user._id,
        name:user.name,
        email:user.email,
        token:token
    })
}

export const loginUser = async(data:LoginInput,res:Response)=>{
    const {email,password}=data
    const user= await UserModel.findOne({email})
    if(!user){
        res.status(401)
        throw new Error("User not found")
    }
    const passIsMatch=await bcrypt.compare(password,user.password)
    if(!passIsMatch){
        res.status(404)
        throw new Error("Invalid creds")
    }
    const token= generateToken(user._id.toString())
     return({
        _id:user._id,
        name:user.name,
        email:user.email,
        token:token
    })
}