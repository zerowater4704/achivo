"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.getGoal = exports.getsGoal = exports.createGoal = void 0;
const Goal_1 = __importDefault(require("../models/Goal"));
const Plan_1 = __importDefault(require("../models/Plan"));
const createGoal = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, isCompleted, progress, startDate, finishDate, plan_id, } = req.body;
        if (!user) {
            res.status(400).json({ message: "ユーザーを見つかりません。" });
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
        const newGoal = new Goal_1.default({
            title,
            description,
            isCompleted,
            progress,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            createdBy: user,
            plan_id,
        });
        await newGoal.save();
        res.status(200).json({ newGoal });
    }
    catch (error) {
        res.status(500).json({ message: "createGoal Apiエラーです。", error });
        return;
    }
};
exports.createGoal = createGoal;
const getsGoal = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーを見つかりません。" });
            return;
        }
        const goals = await Goal_1.default.find({ createdBy: user });
        res.status(200).json(goals);
    }
    catch (error) {
        res.status(500).json({ message: "getsGoal Apiエラーです", error });
    }
};
exports.getsGoal = getsGoal;
const getGoal = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const goalId = req.params.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーを見つかりません。" });
            return;
        }
        const getGoal = await Goal_1.default.findOne({ _id: goalId, createdBy: user });
        if (!getGoal) {
            res.status(400).json({ message: "goalがありません。" });
            return;
        }
        res.status(200).json(getGoal);
    }
    catch (error) {
        res.status(500).json({ message: "getGoal Apiのエラーです。", error });
    }
};
exports.getGoal = getGoal;
const updateGoal = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const goalId = req.params.id;
        const { title, description, isCompleted, progress, startDate, finishDate, plan_id, } = req.body;
        const goal = await Goal_1.default.findById(goalId);
        if (!goal) {
            res.status(400).json({ message: "goalを見つかりません。" });
            return;
        }
        if (goal.createdBy.toString() !== user) {
            res.status(400).json({ message: "更新する権限がありません。" });
            return;
        }
        if (finishDate &&
            startDate &&
            new Date(finishDate) <= new Date(startDate)) {
            res
                .status(400)
                .json({ message: "終了日を開始日より後に設定してください。" });
            return;
        }
        const updatedGoal = await Goal_1.default.findByIdAndUpdate(goalId, {
            title,
            description,
            isCompleted,
            progress,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            plan_id,
        }, { new: true, runValidators: true });
        if (!updatedGoal) {
            res.status(404).json({ message: "ゴールの更新に失敗しました。" });
            return;
        }
        res.status(200).json(updatedGoal);
    }
    catch (error) {
        res.status(500).json({ message: "updateGoal Apiエラーです。", error });
    }
};
exports.updateGoal = updateGoal;
const deleteGoal = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const goalId = req.params.id;
        const goal = await Goal_1.default.findOne({
            createdBy: user,
            _id: goalId,
        });
        if (!goal) {
            res.status(400).json({ message: "goalがありません。" });
            return;
        }
        await Plan_1.default.deleteMany({ goal_id: goalId });
        await goal.deleteOne();
        res.status(200).json({ message: "goalを削除しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteGoal Apiエラーです。" });
    }
};
exports.deleteGoal = deleteGoal;
