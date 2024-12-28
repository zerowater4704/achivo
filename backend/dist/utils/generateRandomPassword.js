"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
async function generateRandomPassword() {
    const rawPassword = Math.random().toString(36).slice(-10);
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(rawPassword, salt);
    return hashedPassword;
}
exports.default = generateRandomPassword;
