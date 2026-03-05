import express from 'express';
import helmet from 'helmet';
import cors from 'cors'
import authRouter from './routes/auth.routes'
const app=express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use(authRouter)

export default app

