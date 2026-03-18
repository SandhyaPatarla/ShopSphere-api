import express from 'express';
import helmet from 'helmet';
import cors from 'cors'
import authRouter from './routes/auth.routes'
import productRouter from './routes/product.routes'
import categoryRouter from './routes/category.routes'
import cartRoutes from './routes/cart.routes'
// import {createClient} from 'redis';
// import cluster, { worker } from 'cluster';
// import os from 'os'

const app=express()
// const redis=createClient();
// redis.connect()

app.use(cors())
app.use(helmet())
app.use(express.json())

//rate limmitter
// const requestedIps:Record<>={}
// const windowSize=60*1000
// const max=100

// app.use((req,res,next)=>{
//     const ip:any=req.ip
//     const currentTime=Date.now()
//     if(!requestedIps[ip]){
//         requestedIps[ip]=[]
//     }
//     requestedIps[ip]=requestedIps[ip].filter((t1:any)=>(currentTime-t1 <windowSize))
//     if(requestedIps[ip].length>=max){
//        return res.status(429).send("too many requests")
//     }
//     requestedIps[ip].push(currentTime)
//     next()
// })

// const maxRequests=100
// const WindowSize=60
// app.use(async(req,res,next)=>{
//     const ip=req.ip
//     const key=`rateLimit:${ip}`
//     const now= Date.now()

//     const windowStart=now-WindowSize*1000
//     await redis.zRemRangeByScore(key,0,windowStart)
//     const length=await redis.zCard(key)

//     if(length>maxRequests){
//         return res.status(429).send("too many requests")

//     }

//     await redis.zAdd(key,{score:now,value:now.toString()})

//     await redis.expire(key,60)
//     next()
// })


app.use(authRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use('/api/cart',cartRoutes)

export default app

