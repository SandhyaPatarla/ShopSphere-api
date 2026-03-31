import {CartModel} from '../models/cart'

export const addToCart=async(userid:any,productid:any,quantity:number)=>{
    let cart:any=await CartModel.findOne({user:userid})

    if(!cart){
        cart=await CartModel.create({
            user:userid,
            items:[{
                product:productid,
                quantity:quantity
                }
            ]
        })
        return cart
    }
    const itemIndex=cart.items.findIndex((item: { product: any })=>item.product.toString()===productid)

    if(itemIndex>-1){
        cart.items[itemIndex].quantity+=quantity
    }else{
        cart.items.push({product:productid,quantity:quantity})
    }

    await cart.save()
    return cart

}

export const getCart = async(userid:any)=>{
    return await CartModel.findOne({user:userid}).populate('items.product')
}
export const updateCart= async(userid:any,productid:any,quantity:any)=>{
    const cart:any=await CartModel.findOne({user:userid})
    if (!cart) {
        throw new Error('Cart not found')
    }
    const itemIndex= cart.items.findIndex((item:{product:any})=>item.product.toString()===productid)
    if (itemIndex < 0) {
        throw new Error('Product is not in cart')
    }
    cart.items[itemIndex].quantity=quantity
    await cart.save()
    return cart 
}

export const removeItem= async(userid:any, productid:any)=>{
    let cart:any=await CartModel.findOne({user:userid})
    if (!cart) {
        throw new Error('Cart not found')
    }
    cart.items= cart.items.filter((item:{product:any})=>item.product.toString()!=productid)
    await cart.save()
}

