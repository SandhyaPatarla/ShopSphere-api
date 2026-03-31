"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODBURL;
console.log("URI:", uri);
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("✅ Connected successfully");
    process.exit(0);
})
    .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
});
