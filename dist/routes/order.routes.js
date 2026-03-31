"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post('/checkout', auth_middleware_1.default, order_controller_1.orderCheckoutController);
router.get('/', auth_middleware_1.default, order_controller_1.listOrdersController);
router.get('/:id', auth_middleware_1.default, order_controller_1.getOrderByIdController);
exports.default = router;
