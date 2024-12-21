import { Router } from "express";
import passport from "passport";
import {
  createPlan,
  deletePlan,
  getPlan,
  getsPlan,
  updatePlan,
} from "../controllers/planController";

const router = Router();

const authenticate = passport.authenticate("jwt", { session: false });

router.post("/create", authenticate, createPlan);
router.get("/plans/:id", authenticate, getsPlan);
router.get("/plans/:id/:planId", authenticate, getPlan);
router.put("/plans/:id/:planId", authenticate, updatePlan);
router.delete("/plans/:id", authenticate, deletePlan);

export default router;
