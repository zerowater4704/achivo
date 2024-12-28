"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function generateRandomPassword() {
    const rawPassword = Math.random().toString(36).slice(-10);
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(rawPassword, salt);
    return hashedPassword;
}
exports.default = generateRandomPassword;
