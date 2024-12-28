"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post("/signup", userController_1.createUser);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/", session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.CLIENT_URL}/?accessToken=${accessToken}`);
});
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.redirect("/");
    });
});
exports.default = router;
