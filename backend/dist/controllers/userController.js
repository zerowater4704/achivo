"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.deleteUser = exports.logout = exports.loginUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../utils/token");
const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res
                .status(400)
                .json({ message: "既に登録されているメールアドレスです。" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            name,
            password: hashedPassword,
        });
        const accessToken = (0, token_1.generateAccessToken)({ id: user.id });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
        await user.save();
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })
            .json({ accessToken, user });
    }
    catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({ message: "createUser apiのエラーです。", error });
        return;
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "入力されたメールアドレスが間違っています。",
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res
                .status(401)
                .json({ message: "入力されたパスワードが間違っています。" });
            return;
        }
        const accessToken = (0, token_1.generateAccessToken)({ id: user.id });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })
            .json({ accessToken, user });
    }
    catch (error) {
        res.status(500).json({ message: "loginUser APIのエラーです。", error });
        return;
    }
};
exports.loginUser = loginUser;
const logout = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(400).json({ message: "ログアウトするトークンがありません。" });
            return;
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "LogOutできました。" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "ログアウト中にエラーが発生しました。", error });
    }
};
exports.logout = logout;
const deleteUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "ユーザーを見つかりません。" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています。" });
            return;
        }
        await User_1.default.findByIdAndDelete(user);
        res.status(200).json({ message: "ユーザーを削除しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteUser apiで失敗しました。" });
    }
};
exports.deleteUser = deleteUser;
const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(403).json({ message: "リフレッシュトークンがありません。" });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, payload) => {
            if (err) {
                return res
                    .status(403)
                    .json({ message: "無効なリフレッシュトークンです。" });
            }
            if (typeof payload === "string" || !payload) {
                return res.status(403).json({ message: "無効なペイロードです。" });
            }
            const userId = payload.id;
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "ユーザーが存在しません。" });
            }
            const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
            res.status(200).json({ accessToken: newAccessToken });
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "トークン再発行中にエラーが発生しました。" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
