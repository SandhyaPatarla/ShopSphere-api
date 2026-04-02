import mongoose , {Document}from "mongoose";

interface OrderItemI{
    product:mongoose.Types.ObjectId,
    quantity:number,
    /** Line price in INR at checkout */
    price:number
}

type statusI= "pending" | "paid" | "shipped" | "delivered"

interface OrderI extends Document {
    user:mongoose.Types.ObjectId,
    items:OrderItemI[],
    /** Sum of line totals in INR */
    totalPrice:number,
    /** ISO 4217; matches Razorpay (INR); may be absent on legacy documents */
    currency?: string,
    status: statusI,
    razorpayOrderId: string | null,
    razorpayPaymentId: string | null,
}

const orderSchema= new mongoose.Schema<OrderI>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    razorpayOrderId:{
        type:String,
        default:null
    },
    razorpayPaymentId:{
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
    currency:{
        type:String,
        default:'INR',
        enum:['INR']
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