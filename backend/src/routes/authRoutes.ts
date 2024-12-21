import express from "express";
import passport from "../config/passport";
import { createUser } from "../controllers/userController";

const router = express.Router();

router.post("/signup", createUser);

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
export default router;
