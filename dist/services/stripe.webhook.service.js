"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentIntentSucceeded = handlePaymentIntentSucceeded;
exports.processStripeWebhookEvent = processStripeWebhookEvent;
exports.constructStripeWebhookEvent = constructStripeWebhookEvent;
const cart_1 = require("../models/cart");
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const stripe_1 = require("../config/stripe");
async function handlePaymentIntentSucceeded(event) {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;
    if (!orderId)
        return;
    const updated = await order_1.OrderModel.findOneAndUpdate({ _id: orderId, status: 'pending' }, { status: 'paid', stripePaymentIntentId: pi.id }, { new: true });
    if (!updated)
        return;
    await cart_1.CartModel.findOneAndUpdate({ user: updated.user }, { $set: { items: [] } });
}
async function releaseOrderStockAndDelete(pi) {
    const orderId = pi.metadata?.orderId;
    if (!orderId)
        return;
    const order = await order_1.OrderModel.findOne({
        _id: orderId,
        status: 'pending',
        stripePaymentIntentId: pi.id
    });
    if (!order)
        return;
    for (const item of order.items) {
        await product_1.ProductModel.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
    await order_1.OrderModel.deleteOne({ _id: order._id });
}
async function processStripeWebhookEvent(event) {
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentIntentSucceeded(event);
            break;
        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
            await releaseOrderStockAndDelete(event.data.object);
            break;
        default:
            break;
    }
}
function constructStripeWebhookEvent(rawBody, signature) {
    const stripe = (0, stripe_1.getStripe)();
    const secret = (0, stripe_1.getStripeWebhookSecret)();
    if (!signature || typeof signature !== 'string') {
        throw new Error('Missing stripe-signature header');
    }
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
