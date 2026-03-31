"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.updateCart = exports.getCart = exports.addToCart = void 0;
const cart_1 = require("../models/cart");
const addToCart = async (userid, productid, quantity) => {
    let cart = await cart_1.CartModel.findOne({ user: userid });
    if (!cart) {
        cart = await cart_1.CartModel.create({
            user: userid,
            items: [{
                    product: productid,
                    quantity: quantity
                }
            ]
        });
        return cart;
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productid);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ product: productid, quantity: quantity });
    }
    await cart.save();
    return cart;
};
exports.addToCart = addToCart;
const getCart = async (userid) => {
    return await cart_1.CartModel.findOne({ user: userid }).populate('items.product');
};
exports.getCart = getCart;
const updateCart = async (userid, productid, quantity) => {
    const cart = await cart_1.CartModel.findOne({ user: userid });
    if (!cart) {
        throw new Error('Cart not found');
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productid);
    if (itemIndex < 0) {
        throw new Error('Product is not in cart');
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return cart;
};
exports.updateCart = updateCart;
const removeItem = async (userid, productid) => {
    let cart = await cart_1.CartModel.findOne({ user: userid });
    if (!cart) {
        throw new Error('Cart not found');
    }
    cart.items = cart.items.filter((item) => item.product.toString() != productid);
    await cart.save();
};
exports.removeItem = removeItem;
