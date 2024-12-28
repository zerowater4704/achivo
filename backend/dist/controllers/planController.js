"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.getPlan = exports.getsPlan = exports.createPlan = void 0;
const Plan_1 = __importDefault(require("../models/Plan"));
const Goal_1 = __importDefault(require("../models/Goal"));
const Task_1 = __importDefault(require("../models/Task"));
const createPlan = async (req, res) => {
    var _a;
    try {
        const { title, description, isCompleted, progress, startDate, finishDate, goal_id, task_id, } = req.body;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        const findGoal = await Goal_1.default.findById(goal_id);
        if (!findGoal) {
            res.status(400).json({ message: "goalがありません" });
            return;
        }
        if (!title || !description || !startDate || !finishDate) {
            res.status(400).json({ message: "入力忘れがあります。" });
            return;
        }
        if (new Date(finishDate) <= new Date(startDate)) {
            res
                .status(400)
                .json({ message: "終了日を開始日より後に設定してください。" });
            return;
        }
        const newPlan = new Plan_1.default({
            title,
            description,
            isCompleted,
            progress,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            createdBy: user,
            goal_id: findGoal,
            task_id,
        });
        await newPlan.save();
        findGoal.plan_id.push(newPlan.id);
        await findGoal.save();
        const relatedGoals = await Plan_1.default.find({ goal_id: findGoal });
        const completedPlans = relatedGoals.filter((goal) => goal.isCompleted).length;
        const totalGoal = relatedGoals.length;
        const goalProgress = totalGoal > 0 ? Math.ceil((completedPlans / totalGoal) * 100) : 0;
        const findUpdateGoal = await Goal_1.default.findByIdAndUpdate(findGoal, { progress: goalProgress }, { new: true });
        res.status(200).json({ newPlan: newPlan, goal: findUpdateGoal });
    }
    catch (error) {
        res.status(500).json({ message: "createPlan Apiエラーです" });
        return;
    }
};
exports.createPlan = createPlan;
const getsPlan = async (req, res) => {
    try {
        // const user = req.user?.id;
        const goalId = req.params.id;
        if (!goalId) {
            res.status(400).json({ message: "goalを見つかりません。" });
            return;
        }
        const plans = await Plan_1.default.find({ goal_id: goalId });
        res.status(200).json(plans || []);
    }
    catch (error) {
        res.status(500).json({ message: "getsPlan Apiエラーです。", error });
        return;
    }
};
exports.getsPlan = getsPlan;
const getPlan = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const goalId = req.params.id;
        const planId = req.params.planId;
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!goalId) {
            res.status(400).json({ message: "goalが見つかりません。" });
            return;
        }
        if (!planId) {
            res.status(400).json({ message: "planIdが見つかりません。" });
            return;
        }
        const plan = await Plan_1.default.findOne({
            _id: planId,
            goal_id: goalId,
            createdBy: user,
        });
        if (!plan) {
            res.status(400).json({ message: "planが見つかりません。" });
            return;
        }
        res.status(200).json(plan);
    }
    catch (error) {
        res.status(500).json({ message: "getPlan Apiエラーです。", error });
        return;
    }
};
exports.getPlan = getPlan;
const updatePlan = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, isCompleted, progress, startDate, finishDate, task_id, goal_id, } = req.body;
        const goalId = req.params.id;
        const planId = req.params.planId;
        const plan = await Plan_1.default.findOne({ goal_id: goalId, _id: planId });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!goalId) {
            res.status(400).json({ message: "goalが見つかりません。" });
            return;
        }
        if (!plan) {
            res.status(400).json({ message: "planが見つかりません。" });
            return;
        }
        if (plan.createdBy.toString() !== user) {
            res.status(400).json({ message: "更新する権限がありません。" });
            return;
        }
        if (new Date(finishDate) <= new Date(startDate)) {
            res
                .status(400)
                .json({ message: "終了日を開始日より後に設定してください。" });
            return;
        }
        const updatedPlan = await Plan_1.default.findByIdAndUpdate(planId, {
            title,
            description,
            isCompleted,
            progress,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            task_id,
            goal_id,
        }, { new: true });
        if (!updatedPlan) {
            res.status(404).json({ message: "planの更新に失敗しました。" });
            return;
        }
        res.status(200).json(updatedPlan);
    }
    catch (error) {
        res.status(500).json({ message: "updatePlan Apiエラーです。", error });
        return;
    }
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const planId = req.params.id;
        const plan = await Plan_1.default.findOne({
            createdBy: user,
            _id: planId,
        });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!plan) {
            res.status(400).json({ message: "planが見つかりません。" });
            return;
        }
        if (plan.createdBy.toString() !== user) {
            res.status(400).json({ message: "削除する権限がありません。" });
            return;
        }
        await Task_1.default.deleteMany({ plan_id: planId });
        const deletedPlan = await Plan_1.default.findByIdAndDelete(planId);
        if (!deletedPlan) {
            res.status(400).json({ message: "plan削除に失敗しました。" });
            return;
        }
        await Goal_1.default.findByIdAndUpdate(deletedPlan.goal_id, {
            $pull: {
                plan_id: planId,
            },
        });
        const relatedGoals = await Plan_1.default.find({ goal_id: plan.goal_id });
        const completedPlans = relatedGoals.filter((goal) => goal.isCompleted).length;
        const totalGoal = relatedGoals.length;
        const goalProgress = totalGoal > 0 ? Math.ceil((completedPlans / totalGoal) * 100) : 0;
        const findUpdateGoal = await Goal_1.default.findByIdAndUpdate(plan.goal_id, { progress: goalProgress }, { new: true });
        res.status(200).json({ message: "planを削除しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "updatePlan Apiエラーです。", error });
        return;
    }
};
exports.deletePlan = deletePlan;
