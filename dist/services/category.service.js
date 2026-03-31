"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = exports.createCategory = void 0;
const category_1 = require("../models/category");
const createCategory = async (data) => {
    return await category_1.CategoryModel.create(data);
};
exports.createCategory = createCategory;
const listCategories = async () => {
    return category_1.CategoryModel.find({ isActive: true }).sort({ name: 1 });
};
exports.listCategories = listCategories;
