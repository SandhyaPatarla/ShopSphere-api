"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getAll = void 0;
const category_service_1 = require("../services/category.service");
const getAll = async (req, res, next) => {
    try {
        const result = await (0, category_service_1.listCategories)();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const create = async (req, res, next) => {
    try {
        const result = await (0, category_service_1.createCategory)(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
