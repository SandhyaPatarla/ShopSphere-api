"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRazorpayWebhookEvent = processRazorpayWebhookEvent;
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const razorpay_order_completion_service_1 = require("./razorpay-order-completion.service");
async function processRazorpayWebhookEvent(body) {
    const event = body.event;
    const entity = body.payload?.payment?.entity;
    if (!event || !entity?.order_id)
        return;
    const razorpayOrderId = entity.order_id;
    const paymentId = entity.id;
    switch (event) {
        case 'payment.captured':
            await (0, razorpay_order_completion_service_1.markOrderPaidAfterCapture)(razorpayOrderId, paymentId);
            break;
        case 'payment.failed':
            await handlePaymentFailed(razorpayOrderId);
            break;
        default:
            break;
    }
}
async function handlePaymentFailed(razorpayOrderId) {
    const order = await order_1.OrderModel.findOne({
        razorpayOrderId,
        status: 'pending'
    });
    if (!order)
        return;
    for (const item of order.items) {
        await product_1.ProductModel.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
    await order_1.OrderModel.deleteOne({ _id: order._id });
}
