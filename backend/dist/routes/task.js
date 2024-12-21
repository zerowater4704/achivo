"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
const authenticate = passport_1.default.authenticate("jwt", { session: false });
router.post("/create", authenticate, taskController_1.createTask);
router.get("/tasks/:id", authenticate, taskController_1.getsTask);
router.get("/tasks/:id/:taskId", authenticate, taskController_1.getTask);
router.put("/tasks/:id/:taskId", authenticate, taskController_1.updateTask);
router.delete("/tasks/:id", authenticate, taskController_1.deleteTask);
exports.default = router;
