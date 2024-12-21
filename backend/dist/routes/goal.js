"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const goalController_1 = require("../controllers/goalController");
const router = (0, express_1.Router)();
const authenticateUser = passport_1.default.authenticate("jwt", { session: false });
router.post("/create", authenticateUser, goalController_1.createGoal);
router.get("/goals", authenticateUser, goalController_1.getsGoal);
router.get("/goals/:id", authenticateUser, goalController_1.getGoal);
router.put("/goals/:id", authenticateUser, goalController_1.updateGoal);
router.delete("/goals/:id", authenticateUser, goalController_1.deleteGoal);
exports.default = router;
