"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const planController_1 = require("../controllers/planController");
const router = (0, express_1.Router)();
const authenticate = passport_1.default.authenticate("jwt", { session: false });
router.post("/create", authenticate, planController_1.createPlan);
router.get("/plans/:id", authenticate, planController_1.getsPlan);
router.get("/plans/:id/:planId", authenticate, planController_1.getPlan);
router.put("/plans/:id/:planId", authenticate, planController_1.updatePlan);
router.delete("/plans/:id", authenticate, planController_1.deletePlan);
exports.default = router;
