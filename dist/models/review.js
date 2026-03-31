"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
exports.ReviewModel = mongoose_1.default.model('Review', reviewSchema);
