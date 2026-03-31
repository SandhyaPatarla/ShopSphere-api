import { CartModel } from "../models/cart"
import { OrderModel } from "../models/order"


export const orderCheckout=async(userId:any)=>{
        const cart:any=await CartModel.findOne({user:userId}).populate("items.product")

        if(!cart || cart.items.quantity===0){
            throw new Error("cart is empty")
        }


        const order:any={}
        order.user=userId
        order.items=[]
        order.totalPrice=0
        cart?.items.forEach((e:any)=>{
            order.totalPrice+=e.quantity* e.product.price
            let product=e.product
            order.items.push({
                product:product._id,
                quantity:e.quantity,
                price:product.price
            })

            })
       const orderRes= await OrderModel.create(order)
       
       cart.items=[]
       await cart.save()
       return orderRes;
}