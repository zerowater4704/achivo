"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "既に登録されています。" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "createUser apiのエラーです。", error });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "パスワードを間違いました" });
            return;
        }
        const generateAccessToken = (payload) => {
            return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
        };
        const generateRefreshToken = (payload) => {
            return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "1d" });
        };
        const accessToken = generateAccessToken({ id: user.id });
        const refreshToken = generateRefreshToken({ id: user.id });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })
            .json({ accessToken });
    }
    catch (error) {
        res.status(500).json({ message: "loginUser APIのエラーです。", error });
    }
};
exports.loginUser = loginUser;
