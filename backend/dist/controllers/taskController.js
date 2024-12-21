"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTask = exports.getsTask = exports.createTask = void 0;
const Plan_1 = __importDefault(require("../models/Plan"));
const Goal_1 = __importDefault(require("../models/Goal"));
const Task_1 = __importDefault(require("../models/Task"));
const createTask = async (req, res) => {
    var _a;
    try {
        const { title, description, status, startDate, finishDate, goal_id, plan_id, } = req.body;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        const findGoal = await Goal_1.default.findById(goal_id);
        const findPlan = await Plan_1.default.findById(plan_id);
        if (!findGoal) {
            res.status(400).json({ message: "goalがありません" });
            return;
        }
        if (!findPlan) {
            res.status(400).json({ message: "planがありません" });
            return;
        }
        if (!title || !description || !startDate || !finishDate) {
            res.status(400).json({ message: "入力忘れがあります。" });
            return;
        }
        if (new Date(finishDate) <= new Date(startDate)) {
            res
                .status(400)
                .json({ message: "finishDateをstartDateより後に設定してください。" });
            return;
        }
        const newTask = new Task_1.default({
            title,
            description,
            status,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            createdBy: user,
            goal_id: findGoal,
            plan_id: findPlan,
        });
        await newTask.save();
        findGoal.task_id.push(newTask.id);
        await findGoal.save();
        findPlan.task_id.push(newTask.id);
        await findPlan.save();
        res.status(200).json({ newTask });
    }
    catch (error) {
        res.status(500).json({ message: "createTask Apiエラーです。" });
        return;
    }
};
exports.createTask = createTask;
const getsTask = async (req, res) => {
    try {
        const planId = req.params.id;
        if (!planId) {
            res.status(400).json({ message: "goalを見つかりません。" });
            return;
        }
        const tasks = await Task_1.default.find({ plan_id: planId });
        res.status(200).json(tasks || []);
    }
    catch (error) {
        res.status(500).json({ message: "getsTask Apiエラーです。", error });
        return;
    }
};
exports.getsTask = getsTask;
const getTask = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const taskId = req.params.taskId;
        const planId = req.params.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!taskId) {
            res.status(400).json({ message: "taskIdが見つかりません。" });
            return;
        }
        if (!planId) {
            res.status(400).json({ message: "planIdが見つかりません。" });
            return;
        }
        const task = await Task_1.default.findOne({
            _id: taskId,
            plan_id: planId,
            createdBy: user,
        });
        if (!task) {
            res.status(400).json({ message: "taskが見つかりません。" });
            return;
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: "getTask Apiエラーです。", error });
        return;
    }
};
exports.getTask = getTask;
const updateTask = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, status, startDate, finishDate, plan_id, goal_id, } = req.body;
        const taskId = req.params.taskId;
        const planId = req.params.id;
        const task = await Task_1.default.findOne({ _id: taskId, plan_id: planId });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!taskId) {
            res.status(400).json({ message: "taskIdが見つかりません。" });
            return;
        }
        if (!task) {
            res.status(400).json({ message: "taskが見つかりません。" });
            return;
        }
        if (task.createdBy.toString() !== user) {
            res.status(400).json({ message: "更新する権限がありません。" });
            return;
        }
        if (new Date(finishDate) <= new Date(startDate)) {
            res
                .status(400)
                .json({ message: "finishDateをstartDateより後に設定してください。" });
            return;
        }
        const updatedTask = await Task_1.default.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            plan_id,
            goal_id,
        }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ message: "planの更新に失敗しました。" });
            return;
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "updateTask Apiエラーです。", error });
        return;
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const taskId = req.params.id;
        const task = await Task_1.default.findOne({ createdBy: user, _id: taskId });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        if (!task) {
            res.status(400).json({ message: "taskが見つかりません。" });
            return;
        }
        if (task.createdBy.toString() !== user) {
            res.status(400).json({ message: "削除する権限がありません。" });
            return;
        }
        await Task_1.default.findByIdAndDelete(taskId);
        res.status(200).json({ message: "taskを削除しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteTask Apiエラーです。", error });
        return;
    }
};
exports.deleteTask = deleteTask;
