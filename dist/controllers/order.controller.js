"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdController = exports.verifyRazorpayPaymentController = exports.listOrdersController = exports.orderCheckoutController = void 0;
const order_service_1 = require("../services/order.service");
const orderCheckoutController = async (req, res, next) => {
    try {
        const result = await (0, order_service_1.prepareOrderCheckout)(req.user._id);
        res.status(201).json({
            message: 'Order created — pay in INR (₹). Open Razorpay Checkout with keyId, razorpayOrderId, amount in paise (100 paise = ₹1), and currency',
            order: result.order,
            razorpayOrderId: result.razorpayOrderId,
            keyId: result.keyId,
            amount: result.amount,
            currency: result.currency
        });
    }
    catch (e) {
        next(e);
    }
};
exports.orderCheckoutController = orderCheckoutController;
const listOrdersController = async (req, res, next) => {
    try {
        const orders = await (0, order_service_1.listOrdersForUser)(req.user._id);
        res.status(200).json(orders);
    }
    catch (e) {
        next(e);
    }
};
exports.listOrdersController = listOrdersController;
const verifyRazorpayPaymentController = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {};
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400);
            throw new Error('razorpay_order_id, razorpay_payment_id, and razorpay_signature are required');
        }
        const order = await (0, order_service_1.verifyRazorpayPaymentAndCompleteOrder)(req.user._id, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });
        res.status(200).json({ message: 'Payment verified', order });
    }
    catch (e) {
        next(e);
    }
};
exports.verifyRazorpayPaymentController = verifyRazorpayPaymentController;
const getOrderByIdController = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const order = await (0, order_service_1.getOrderByIdForRequester)(req.params.id, req.user._id, isAdmin);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        res.status(200).json(order);
    }
    catch (e) {
        next(e);
    }
};
exports.getOrderByIdController = getOrderByIdController;
