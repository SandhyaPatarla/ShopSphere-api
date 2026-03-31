"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const product_controller_1 = require("../controllers/product.controller");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
router.post('/product', auth_middleware_1.default, admin_middleware_1.isAdmin, product_controller_1.create);
router.get('/product', product_controller_1.getAll);
router.get('/product/:id', product_controller_1.getById);
router.put('/product/:id', auth_middleware_1.default, admin_middleware_1.isAdmin, product_controller_1.updateById);
router.delete('/product/:id', auth_middleware_1.default, admin_middleware_1.isAdmin, product_controller_1.deleteById);
exports.default = router;
