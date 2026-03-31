"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackCheckoutOrder = rollbackCheckoutOrder;
exports.prepareOrderCheckout = prepareOrderCheckout;
exports.orderCheckout = orderCheckout;
exports.listOrdersForUser = listOrdersForUser;
exports.getOrderByIdForRequester = getOrderByIdForRequester;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = require("../models/cart");
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const stripe_1 = require("../config/stripe");
function cartLineQuantitySum(items) {
    return items.reduce((s, i) => s + (i.quantity || 0), 0);
}
async function rollbackCheckoutOrder(orderId) {
    const order = await order_1.OrderModel.findById(orderId);
    if (!order)
        return;
    for (const item of order.items) {
        await product_1.ProductModel.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
    await order_1.OrderModel.deleteOne({ _id: orderId });
}
/** Validates cart, decrements stock, creates pending order, returns Stripe client secret. Cart is cleared after successful payment (webhook). */
async function prepareOrderCheckout(userId) {
    const session = await mongoose_1.default.startSession();
    let createdOrderId = null;
    try {
        session.startTransaction();
        const cart = await cart_1.CartModel.findOne({ user: userId })
            .session(session)
            .populate('items.product');
        if (!cart || !cart.items.length || cartLineQuantitySum(cart.items) === 0) {
            throw new Error('Cart is empty');
        }
        const itemsPayload = [];
        let totalPrice = 0;
        for (const line of cart.items) {
            const product = line.product;
            if (!product || !product._id) {
                throw new Error('Invalid product in cart');
            }
            if (product.stock < line.quantity) {
                throw new Error(`Insufficient stock for product ${product._id}`);
            }
            totalPrice += line.quantity * product.price;
            itemsPayload.push({
                product: product._id,
                quantity: line.quantity,
                price: product.price
            });
        }
        for (const line of cart.items) {
            const productId = line.product._id;
            const res = await product_1.ProductModel.updateOne({ _id: productId, stock: { $gte: line.quantity } }, { $inc: { stock: -line.quantity } }, { session });
            if (res.modifiedCount !== 1) {
                throw new Error(`Could not reserve stock for product ${productId}`);
            }
        }
        const [order] = await order_1.OrderModel.create([
            {
                user: userId,
                items: itemsPayload,
                totalPrice,
                status: 'pending'
            }
        ], { session });
        createdOrderId = order._id;
        await session.commitTransaction();
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
    const order = await order_1.OrderModel.findById(createdOrderId);
    if (!order) {
        throw new Error('Order was not persisted');
    }
    const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();
    const amountCents = Math.round(order.totalPrice * 100);
    if (amountCents < 50) {
        await rollbackCheckoutOrder(order._id);
        throw new Error('Order total is below the minimum charge amount for this currency (Stripe test: use at least $0.50 USD total)');
    }
    try {
        const stripe = (0, stripe_1.getStripe)();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString()
            },
            automatic_payment_methods: { enabled: true }
        });
        await order_1.OrderModel.findByIdAndUpdate(order._id, {
            stripePaymentIntentId: paymentIntent.id
        });
        const updatedOrder = await order_1.OrderModel.findById(order._id).populate('items.product');
        return {
            order: updatedOrder,
            clientSecret: paymentIntent.client_secret,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
        };
    }
    catch (e) {
        await rollbackCheckoutOrder(order._id);
        throw e;
    }
}
/** @deprecated Use prepareOrderCheckout — kept for clarity in docs */
async function orderCheckout(userId) {
    return prepareOrderCheckout(userId);
}
async function listOrdersForUser(userId) {
    return order_1.OrderModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('items.product');
}
async function getOrderByIdForRequester(orderId, userId, isAdmin) {
    const filter = { _id: orderId };
    if (!isAdmin) {
        filter.user = userId;
    }
    return order_1.OrderModel.findOne(filter).populate('items.product');
}
