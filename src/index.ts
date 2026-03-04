import app from '../src/app'
import dotenv from 'dotenv'
import { db } from './db/mongoose'
dotenv.config()

const PORT= process.env.PORT || 3001
db.then(()=>{
    console.log("db connected")
    app.listen(PORT,()=>{
    console.log("server is running in port", PORT)
})
}).catch((e)=>{
    console.log(e)
})
