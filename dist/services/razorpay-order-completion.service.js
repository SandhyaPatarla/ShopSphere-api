"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOrderPaidAfterCapture = markOrderPaidAfterCapture;
const cart_1 = require("../models/cart");
const order_1 = require("../models/order");
/**
 * Marks a pending order paid and clears the user's cart. Idempotent if already paid.
 * Used by webhook (payment.captured) and by POST /verify-payment after Checkout success.
 */
async function markOrderPaidAfterCapture(razorpayOrderId, razorpayPaymentId) {
    const update = { status: 'paid' };
    if (razorpayPaymentId) {
        update.razorpayPaymentId = razorpayPaymentId;
    }
    const updated = await order_1.OrderModel.findOneAndUpdate({ razorpayOrderId, status: 'pending' }, update, { new: true });
    if (!updated) {
        const alreadyPaid = await order_1.OrderModel.findOne({ razorpayOrderId, status: 'paid' });
        if (alreadyPaid) {
            return { updated: false, orderId: alreadyPaid._id.toString() };
        }
        return { updated: false };
    }
    await cart_1.CartModel.findOneAndUpdate({ user: updated.user }, { $set: { items: [] } });
    return { updated: true, orderId: updated._id.toString() };
}
