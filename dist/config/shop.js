"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopCurrency = getShopCurrency;
/**
 * Shop catalog and Razorpay use the same currency (default INR / ₹).
 * Set RAZORPAY_CURRENCY in .env (e.g. INR).
 */
function getShopCurrency() {
    return (process.env.RAZORPAY_CURRENCY || 'INR').toUpperCase();
}
