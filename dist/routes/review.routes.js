"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const review_controller_1 = require("../controllers/review.controller");
const router = express_1.default.Router();
router.get('/product/:productId', review_controller_1.listReviewsController);
router.post('/', auth_middleware_1.default, review_controller_1.createReviewController);
exports.default = router;
