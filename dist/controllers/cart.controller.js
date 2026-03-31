"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductFromCart = exports.updateCartController = exports.getCartController = exports.addToCartController = void 0;
const cart_service_1 = require("../services/cart.service");
const addToCartController = async (req, res, next) => {
    try {
        let result = await (0, cart_service_1.addToCart)(req.user._id, req.body.productId, req.body.quantity);
        res.status(201).json({ result });
    }
    catch (e) {
        next(e);
    }
};
exports.addToCartController = addToCartController;
const getCartController = async (req, res, next) => {
    try {
        let result = await (0, cart_service_1.getCart)(req.user._id);
        res.status(200).json({ result });
    }
    catch (e) {
        next(e);
    }
};
exports.getCartController = getCartController;
const updateCartController = async (req, res, next) => {
    try {
        let result = await (0, cart_service_1.updateCart)(req.user._id, req.body.productId, req.body.quantity);
        res.status(200).json({ result });
    }
    catch (e) {
        next(e);
    }
};
exports.updateCartController = updateCartController;
const deleteProductFromCart = async (req, res, next) => {
    try {
        let result = await (0, cart_service_1.removeItem)(req.user._id, req.params.productId);
        res.status(200).json({ result });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteProductFromCart = deleteProductFromCart;
