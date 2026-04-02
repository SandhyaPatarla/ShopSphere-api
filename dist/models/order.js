"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR',
        enum: ['INR']
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered"],
        default: "pending"
    }
}, {
    timestamps: true
});
orderSchema.index({ user: 1, createdAt: -1 });
exports.OrderModel = mongoose_1.default.model("Order", orderSchema);
