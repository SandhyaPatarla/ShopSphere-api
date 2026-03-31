"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.listReviewsForProduct = listReviewsForProduct;
const product_1 = require("../models/product");
const review_1 = require("../models/review");
async function createReview(userId, productId, rating, comment) {
    const product = await product_1.ProductModel.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }
    const review = await review_1.ReviewModel.create({
        user: userId,
        product: productId,
        rating,
        comment
    });
    const newCount = product.ratingsCount + 1;
    const newAvg = newCount === 0 ? rating : (product.ratingsAverage * product.ratingsCount + rating) / newCount;
    await product_1.ProductModel.findByIdAndUpdate(productId, {
        $push: { reviews: review._id },
        ratingsAverage: newAvg,
        ratingsCount: newCount
    });
    return review_1.ReviewModel.findById(review._id).populate('user', 'name email');
}
async function listReviewsForProduct(productId) {
    return review_1.ReviewModel.find({ product: productId, isApproved: true })
        .sort({ createdAt: -1 })
        .populate('user', 'name');
}
