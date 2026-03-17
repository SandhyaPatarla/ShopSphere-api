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
    const itemIndex= cart.items.findIndex((item:{product:any})=>item.product.toString()===productid)
    cart.items[itemIndex].quantity=quantity
    await cart.save()
    return cart
}

export const removeItem= async(userid:any, productid:any)=>{
    let cart:any=await CartModel.findOne({user:userid})
    cart.items= cart.items.filter((item:{product:any})=>item.product.toString()!=productid)
    await cart.save()
}

