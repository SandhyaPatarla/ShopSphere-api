"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUser = void 0;
const user_service_1 = require("../services/user.service");
const handleGetUser = async (req, res, next) => {
    try {
        const result = await (0, user_service_1.getUser)(req.params.id);
        res.json({ result });
    }
    catch (e) {
        next(e);
    }
};
exports.handleGetUser = handleGetUser;
