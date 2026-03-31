"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const user_1 = require("../models/user");
const getUser = async (id) => {
    const user = await user_1.UserModel.findById(id);
    return user;
};
exports.getUser = getUser;
