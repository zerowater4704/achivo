import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  logout,
  refreshAccessToken,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.delete("/delete", deleteUser);
router.post("/refresh", refreshAccessToken);

export default router;
