import {UserModel} from '../models/user'


interface SignupInput{
    name:string;
    email:string;
    password:string
}

export const signupUser= async(data:SignupInput)=>{
    const {name,email,password}=data
    const existingUser= await UserModel.findOne({email})
    if(existingUser) throw new Error("user already exists")
    
}