"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.create = void 0;
const product_service_1 = require("../services/product.service");
const create = async (req, res, next) => {
    try {
        const result = await (0, product_service_1.createProduct)(req.body, req.user._id);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const result = await (0, product_service_1.getAllProducts)(req.query);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const result = await (0, product_service_1.getProductById)(req.params.id.toString());
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const updateById = async (req, res, next) => {
    try {
        const result = await (0, product_service_1.updateProductById)(req.params.id.toString(), req.body);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateById = updateById;
const deleteById = async (req, res, next) => {
    try {
        const result = await (0, product_service_1.deleteProductById)(req.params.id.toString());
        res.json({ message: "deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteById = deleteById;
