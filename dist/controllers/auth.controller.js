"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const auth_service_1 = require("../services/auth.service");
const signup = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.signupUser)(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.loginUser)(req.body, res);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
