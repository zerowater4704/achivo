"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_contoroller_1 = require("../controllers/user-contoroller");
const router = express_1.default.Router();
router.post("/signup", user_contoroller_1.createUser);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   }
// );
// router.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.redirect("/");
//   });
// });
exports.default = router;
