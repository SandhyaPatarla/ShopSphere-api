import express from 'express'
import jwt from 'jsonwebtoken'
// import rateLimitter from 'express-rate-limit'

const app=express()

// const limiter=rateLimitter({
//     windowMs:15*60*1000,
//     max:100,
//     message:"too many requests , please try again later"
// })

// app.use(limiter)

// const WindowSize= 60*1000
// const reqlimit=5
// const requestCounts={}
// app.use((req,res,next)=>{
//     const ip=req.ip
//     if(!requestCounts[ip]){
//         requestCounts[ip]=[]
//     }
//     const currentTime=Date.now()
//     requestCounts[ip]=requestCounts[ip].filter(
//         (timeStamp)=>currentTime-timeStamp<WindowSize
//     )
//     if(!requestCounts[ip].length<reqlimit){
//         res.send("too many requests")
//     }

//     requestCounts[ip].push(currentTime)
//     next()
// })

// const auth=async(req,res,next)=>{
//     let authHeader=req.headers.authorization
//     if(!authHeader || !authHeader.startsWith("Bearer ")){
//         res.status(401).send("unauthorised")
//     }
//     let token=authHeader.replace("Bearer ","")
//     let decoded=jwt.verify(token,"mytoken")
//     let user=await User.findById(decoded.id)
    
// }


// app.use(express.json())

// app.get('/',(req,res)=>{
//     console.log("I am running")
//     res.send("hey hi")
// })

// app.listen(3000,()=>{
//     console.log("I am listening")
// })


// let x:number=10;

// type user={
//     name:string,
//     age:number,
//     hobbies:Array<string>,
//     status:status
// }

// type status="active" |"inactive"

// let user1:user={name:'sandy',age:23,hobbies:["cooking"],status:"active"}

// function addNumbers(num1:number,num2:number):void{
//      num1+num2
// }

// addNumbers(1,2)


// type ListType<T>={
//     list:T[]
// }

// enum Role{
//     user,
//     admin
// }

// let u1:Role= Role.admin

// let value:unknown="hello"

// let a=(value as string).length

function c1(){
    for(var i=0;i<3;i++){
        setTimeout(()=>{
            console.log("i=",i)
        })
    }
    for(let j=0;j<3;j++){
        setTimeout(()=>{
            console.log("j=",j)
        })
    }
}

c1()


function c2(){
    console.log("1")
    setTimeout(()=>{
        console.log("2")
        Promise.resolve().then(()=>{
            console.log("3")
        })
    },10)
    Promise.resolve().then(()=>{
        console.log("4")
        setTimeout(()=>
        {
            console.log("5")
        })
    }).then(()=>{
        console.log(8)
    })
    console.log(6)
}
c2()