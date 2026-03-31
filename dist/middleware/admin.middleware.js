"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Access Denied');
    }
    next();
};
exports.isAdmin = isAdmin;
