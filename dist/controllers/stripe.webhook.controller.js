"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookController = stripeWebhookController;
const stripe_webhook_service_1 = require("../services/stripe.webhook.service");
async function stripeWebhookController(req, res) {
    try {
        const signature = req.headers['stripe-signature'];
        const event = (0, stripe_webhook_service_1.constructStripeWebhookEvent)(req.body, signature);
        await (0, stripe_webhook_service_1.processStripeWebhookEvent)(event);
        res.status(200).json({ received: true });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Webhook handler error';
        res.status(400).send(`Webhook Error: ${message}`);
    }
}
