"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStripe = getStripe;
exports.getStripeWebhookSecret = getStripeWebhookSecret;
const stripe_1 = __importDefault(require("stripe"));
let stripeSingleton = null;
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    if (!stripeSingleton) {
        stripeSingleton = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    }
    return stripeSingleton;
}
function getStripeWebhookSecret() {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    return secret;
}
