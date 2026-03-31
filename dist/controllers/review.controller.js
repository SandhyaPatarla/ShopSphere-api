"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviewsController = exports.createReviewController = void 0;
const review_service_1 = require("../services/review.service");
const createReviewController = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!productId || rating == null || !comment) {
            res.status(400);
            throw new Error('productId, rating, and comment are required');
        }
        const r = Number(rating);
        if (Number.isNaN(r) || r < 1 || r > 5) {
            res.status(400);
            throw new Error('rating must be between 1 and 5');
        }
        const result = await (0, review_service_1.createReview)(req.user._id, String(productId), r, String(comment));
        res.status(201).json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.createReviewController = createReviewController;
const listReviewsController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const result = await (0, review_service_1.listReviewsForProduct)(productId);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.listReviewsController = listReviewsController;
