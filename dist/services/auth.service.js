"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const user_1 = require("../models/user");
const generateToken_1 = require("../utils/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signupUser = async (data) => {
    const { name, email, password, role } = data;
    const existingUser = await user_1.UserModel.findOne({ email });
    if (existingUser)
        throw new Error("user already exists");
    const user = await user_1.UserModel.create({
        name,
        email,
        password,
        role
    });
    const token = (0, generateToken_1.generateToken)(user._id.toString());
    return ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
    });
};
exports.signupUser = signupUser;
const loginUser = async (data, res) => {
    const { email, password } = data;
    const user = await user_1.UserModel.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }
    const passIsMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!passIsMatch) {
        res.status(404);
        throw new Error("Invalid creds");
    }
    const token = (0, generateToken_1.generateToken)(user._id.toString());
    return ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
    });
};
exports.loginUser = loginUser;
