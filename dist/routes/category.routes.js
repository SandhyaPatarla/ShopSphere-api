"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
router.get('/category', category_controller_1.getAll);
router.post('/category', auth_middleware_1.default, admin_middleware_1.isAdmin, category_controller_1.create);
exports.default = router;
