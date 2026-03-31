"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdController = exports.listOrdersController = exports.orderCheckoutController = void 0;
const order_service_1 = require("../services/order.service");
const orderCheckoutController = async (req, res, next) => {
    try {
        const result = await (0, order_service_1.prepareOrderCheckout)(req.user._id);
        res.status(201).json({
            message: 'Order created — complete payment with the clientSecret on your frontend (Stripe.js)',
            order: result.order,
            clientSecret: result.clientSecret,
            publishableKey: result.publishableKey
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
