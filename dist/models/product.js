"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR',
        enum: ['INR']
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reviews: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Review'
        }],
    ratingsAverage: {
        type: Number,
        min: 0,
        default: 0
    },
    ratingsCount: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
productSchema.index({ name: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ category: 1, price: 1 });
exports.ProductModel = mongoose_1.default.model('Product', productSchema);
