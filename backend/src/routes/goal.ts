import { Router } from "express";
import passport from "passport";
import {
  createGoal,
  deleteGoal,
  getGoal,
  getsGoal,
  updateGoal,
} from "../controllers/goalController";

const router = Router();

const authenticateUser = passport.authenticate("jwt", { session: false });

router.post("/create", authenticateUser, createGoal);
router.get("/goals", authenticateUser, getsGoal);
router.get("/goals/:id", authenticateUser, getGoal);
router.put("/goals/:id", authenticateUser, updateGoal);
router.delete("/goals/:id", authenticateUser, deleteGoal);

export default router;
