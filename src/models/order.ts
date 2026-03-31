import mongoose , {Document}from "mongoose";

interface OrderItemI{
    product:mongoose.Types.ObjectId,
    quantity:number,
    price:number
}

type statusI= "pending" | "paid" | "shipped" | "delivered"

interface OrderI extends Document {
    user:mongoose.Types.ObjectId,
    items:OrderItemI[],
    totalPrice:number,
    status: statusI,
    stripePaymentIntentId:string | null
}

const orderSchema= new mongoose.Schema<OrderI>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    stripePaymentIntentId:{
        type:String,
        default:null
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
            quantity:{
                type:Number,
            },
            price:{
                type:Number
            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending" , "paid" , "shipped" , "delivered"],
        default:"pending"
    }
},{
    timestamps:true
})

orderSchema.index({ user: 1, createdAt: -1 })

export const OrderModel=mongoose.model("Order",orderSchema)