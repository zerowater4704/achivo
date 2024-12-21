import { Router } from "express";
import passport from "passport";
import {
  createTask,
  deleteTask,
  getsTask,
  getTask,
  updateTask,
} from "../controllers/taskController";

const router = Router();

const authenticate = passport.authenticate("jwt", { session: false });

router.post("/create", authenticate, createTask);
router.get("/tasks/:id", authenticate, getsTask);
router.get("/tasks/:id/:taskId", authenticate, getTask);
router.put("/tasks/:id/:taskId", authenticate, updateTask);
router.delete("/tasks/:id", authenticate, deleteTask);

export default router;
