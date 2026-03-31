"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("./db/mongoose");
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
mongoose_1.db.then(() => {
    console.log("db connected");
    app_1.default.listen(PORT, () => {
        console.log("server is running in port", PORT);
    });
}).catch((e) => {
    console.log(e);
});
