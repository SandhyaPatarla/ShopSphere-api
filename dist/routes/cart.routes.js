"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.post("/", auth_middleware_1.default, cart_controller_1.addToCartController);
router.get("/", auth_middleware_1.default, cart_controller_1.getCartController);
router.put("/", auth_middleware_1.default, cart_controller_1.updateCartController);
router.delete("/:productId", auth_middleware_1.default, cart_controller_1.deleteProductFromCart);
exports.default = router;
