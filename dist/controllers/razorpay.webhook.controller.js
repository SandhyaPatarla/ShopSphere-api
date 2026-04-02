"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhookController = razorpayWebhookController;
const razorpay_1 = __importDefault(require("razorpay"));
const razorpay_2 = require("../config/razorpay");
const razorpay_webhook_service_1 = require("../services/razorpay.webhook.service");
async function razorpayWebhookController(req, res) {
    try {
        const sigHeader = req.headers['x-razorpay-signature'];
        const signature = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;
        const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body ?? '');
        const secret = (0, razorpay_2.getRazorpayWebhookSecret)();
        if (!signature) {
            res.status(400).send('Missing x-razorpay-signature');
            return;
        }
        const valid = razorpay_1.default.validateWebhookSignature(rawBody, signature, secret);
        if (!valid) {
            res.status(400).send('Invalid webhook signature');
            return;
        }
        const body = JSON.parse(rawBody);
        await (0, razorpay_webhook_service_1.processRazorpayWebhookEvent)(body);
        res.status(200).json({ received: true });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Webhook handler error';
        res.status(400).send(`Webhook Error: ${message}`);
    }
}
