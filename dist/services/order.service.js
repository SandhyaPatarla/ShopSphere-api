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
exports.verifyRazorpayPaymentAndCompleteOrder = verifyRazorpayPaymentAndCompleteOrder;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_1 = require("../models/cart");
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const shop_1 = require("../config/shop");
const razorpay_1 = require("../config/razorpay");
const razorpay_order_completion_service_1 = require("./razorpay-order-completion.service");
const razorpay_payment_verify_1 = require("../utils/razorpay-payment-verify");
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
/** Validates cart, decrements stock, creates pending order, creates Razorpay order. Cart is cleared after successful payment (webhook or POST /verify-payment). */
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
                currency: (0, shop_1.getShopCurrency)(),
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
    const currency = (0, shop_1.getShopCurrency)();
    const amountPaise = Math.round(order.totalPrice * 100);
    if (amountPaise < 100) {
        await rollbackCheckoutOrder(order._id);
        throw new Error('Order total must be at least ₹1 INR (100 paise) for Razorpay');
    }
    try {
        const rzp = (0, razorpay_1.getRazorpay)();
        const receipt = `rcp_${order._id.toString()}`.slice(0, 40);
        const rzpOrder = await rzp.orders.create({
            amount: amountPaise,
            currency,
            receipt,
            notes: {
                orderId: order._id.toString(),
                userId: userId.toString()
            }
        });
        await order_1.OrderModel.findByIdAndUpdate(order._id, {
            razorpayOrderId: rzpOrder.id
        });
        const updatedOrder = await order_1.OrderModel.findById(order._id).populate('items.product');
        return {
            order: updatedOrder,
            razorpayOrderId: rzpOrder.id,
            keyId: process.env.RAZORPAY_KEY_ID || '',
            amount: amountPaise,
            currency
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
/**
 * Verifies Checkout success using Razorpay signature (HMAC with Key Secret) and API payment status,
 * then marks the order paid. Use when webhooks are not configured (e.g. local demo).
 */
async function verifyRazorpayPaymentAndCompleteOrder(userId, body) {
    const keySecret = (0, razorpay_1.getRazorpayKeySecret)();
    const valid = (0, razorpay_payment_verify_1.validatePaymentVerification)({
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id
    }, body.razorpay_signature, keySecret);
    if (!valid) {
        throw new Error('Invalid Razorpay payment signature');
    }
    const rzp = (0, razorpay_1.getRazorpay)();
    const payment = await rzp.payments.fetch(body.razorpay_payment_id);
    if (payment.order_id != null && payment.order_id !== body.razorpay_order_id) {
        throw new Error('Payment does not match this order');
    }
    const status = payment.status;
    if (status !== 'captured' && status !== 'authorized') {
        throw new Error(`Payment not successful (status: ${status ?? 'unknown'})`);
    }
    const order = await order_1.OrderModel.findOne({
        user: userId,
        razorpayOrderId: body.razorpay_order_id
    });
    if (!order) {
        throw new Error('Order not found or does not belong to this user');
    }
    if (order.status === 'paid') {
        return order_1.OrderModel.findById(order._id).populate('items.product');
    }
    if (order.status !== 'pending') {
        throw new Error('Order cannot be paid in its current state');
    }
    const result = await (0, razorpay_order_completion_service_1.markOrderPaidAfterCapture)(body.razorpay_order_id, body.razorpay_payment_id);
    if (result.updated) {
        return order_1.OrderModel.findById(result.orderId).populate('items.product');
    }
    if (result.orderId) {
        return order_1.OrderModel.findById(result.orderId).populate('items.product');
    }
    throw new Error('Could not complete order');
}
