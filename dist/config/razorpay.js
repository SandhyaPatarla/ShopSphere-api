"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRazorpay = getRazorpay;
exports.getRazorpayKeySecret = getRazorpayKeySecret;
exports.getRazorpayWebhookSecret = getRazorpayWebhookSecret;
const razorpay_1 = __importDefault(require("razorpay"));
let instance = null;
function getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
    }
    if (!instance) {
        instance = new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
    }
    return instance;
}
function getRazorpayKeySecret() {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        throw new Error('RAZORPAY_KEY_SECRET is not set');
    }
    return secret;
}
function getRazorpayWebhookSecret() {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error('RAZORPAY_WEBHOOK_SECRET is not set');
    }
    return secret;
}
