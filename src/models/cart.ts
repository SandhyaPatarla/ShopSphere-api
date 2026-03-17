import mongoose, {Document, Types} from 'mongoose';

interface CartItemI{
    product:mongoose.Types.ObjectId;
    quantity:number
}

interface CartI extends Document{
    items:CartItemI[],
    user:mongoose.Types.ObjectId
}

const cartSchema= new mongoose.Schema<CartI>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
        unique:true
    },
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            require:true
        },
        quantity:{
            type:Number,
            default:1
        }
    }]
},{
    timestamps:true
})

export const CartModel= mongoose.model('Cart',cartSchema)