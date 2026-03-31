"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
dotenv_1.default.config();
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
        const bearerToken = authHeader.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await user_1.UserModel.findById(decoded.id);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = auth;
