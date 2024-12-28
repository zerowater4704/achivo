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
        const { title, description, isCompleted, startDate, finishDate, plan_id } = req.body;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        const findPlan = await Plan_1.default.findById(plan_id);
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
                .json({ message: "終了日を開始日より後に設定してください。" });
            return;
        }
        const newTask = new Task_1.default({
            title,
            description,
            isCompleted,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            createdBy: user,
            plan_id: findPlan,
        });
        await newTask.save();
        findPlan.task_id.push(newTask.id);
        await findPlan.save();
        const relatedTasks = await Task_1.default.find({ plan_id: findPlan });
        const completedTasks = relatedTasks.filter((task) => task.isCompleted).length;
        const totalTask = relatedTasks.length;
        const planProgress = totalTask > 0 ? Math.ceil((completedTasks / totalTask) * 100) : 0;
        const isPlanComplete = planProgress === 100;
        const finalUpdatedPlan = await Plan_1.default.findByIdAndUpdate(findPlan, { progress: planProgress, isCompleted: isPlanComplete }, { new: true });
        if (!finalUpdatedPlan) {
            res.status(404).json({ message: "Plan進捗の更新に失敗しました。" });
            return;
        }
        const relatedPlans = await Plan_1.default.find({ goal_id: finalUpdatedPlan.goal_id });
        const completedPlans = relatedPlans.filter((plan) => plan.isCompleted).length;
        const totalPlan = relatedPlans.length;
        const goalProgress = totalPlan > 0 ? Math.ceil((completedPlans / totalPlan) * 100) : 0;
        const isGoalComplete = goalProgress === 100;
        const finalUpdatedGoal = await Goal_1.default.findByIdAndUpdate(finalUpdatedPlan.goal_id, { progress: goalProgress, isCompleted: isGoalComplete }, { new: true });
        res
            .status(200)
            .json({ task: newTask, plan: finalUpdatedPlan, goal: finalUpdatedGoal });
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
        const { title, description, isCompleted, startDate, finishDate, plan_id } = req.body;
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
                .json({ message: "終了日を開始日より後に設定してください。" });
            return;
        }
        const updatedTask = await Task_1.default.findByIdAndUpdate(taskId, {
            title,
            description,
            isCompleted,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            plan_id,
        }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ message: "planの更新に失敗しました。" });
            return;
        }
        const relatedPlan = await Task_1.default.find({ plan_id: planId });
        const completedTask = relatedPlan.filter((task) => task.isCompleted).length;
        const totalTask = relatedPlan.length;
        const progress = totalTask > 0 ? Math.ceil((completedTask / totalTask) * 100) : 0;
        const isComplete = progress === 100;
        const updatedPlan = await Plan_1.default.findByIdAndUpdate(planId, { progress, isCompleted: isComplete }, { new: true });
        const relatedPlans = await Plan_1.default.find({ goal_id: updatedPlan === null || updatedPlan === void 0 ? void 0 : updatedPlan.goal_id });
        const completedPlans = relatedPlans.filter((plan) => plan.isCompleted).length;
        const totalPlans = relatedPlans.length;
        const goalProgress = totalPlans > 0 ? Math.ceil((completedPlans / totalPlans) * 100) : 0;
        const updatedGoal = await Goal_1.default.findByIdAndUpdate(updatedPlan === null || updatedPlan === void 0 ? void 0 : updatedPlan.goal_id, { progress: goalProgress }, { new: true });
        res.status(200).json({
            message: "taskの達成度からplanの達成度が更新されました。",
            task: updatedTask,
            plan: updatedPlan,
            goal: updatedGoal,
        });
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
        const deletedTask = await Task_1.default.findByIdAndDelete(taskId);
        if (!deletedTask) {
            res.status(404).json({ message: "Taskの削除に失敗しました。" });
            return;
        }
        const updatedPlan = await Plan_1.default.findByIdAndUpdate(deletedTask === null || deletedTask === void 0 ? void 0 : deletedTask.plan_id, {
            $pull: {
                task_id: taskId,
            },
        });
        if (!updatedPlan) {
            res.status(404).json({ message: "Planの更新に失敗しました。" });
            return;
        }
        const relatedTasks = await Task_1.default.find({ plan_id: deletedTask === null || deletedTask === void 0 ? void 0 : deletedTask.plan_id });
        const completedTasks = relatedTasks.filter((task) => task.isCompleted).length;
        const totalTask = relatedTasks.length;
        const planProgress = totalTask > 0 ? Math.ceil((completedTasks / totalTask) * 100) : 0;
        const isPlanComplete = planProgress === 100;
        const finalUpdatedPlan = await Plan_1.default.findByIdAndUpdate(deletedTask === null || deletedTask === void 0 ? void 0 : deletedTask.plan_id, { progress: planProgress, isCompleted: isPlanComplete }, { new: true });
        if (!finalUpdatedPlan) {
            res.status(404).json({ message: "Plan進捗の更新に失敗しました。" });
            return;
        }
        const relatedPlans = await Plan_1.default.find({ goal_id: finalUpdatedPlan.goal_id });
        const completedPlans = relatedPlans.filter((plan) => plan.isCompleted).length;
        const totalPlan = relatedPlans.length;
        const goalProgress = totalPlan > 0 ? Math.ceil((completedPlans / totalPlan) * 100) : 0;
        const isGoalComplete = goalProgress === 100;
        const finalUpdatedGoal = await Goal_1.default.findByIdAndUpdate(finalUpdatedPlan.goal_id, { progress: goalProgress, isCompleted: isGoalComplete }, { new: true });
        res.status(200).json({
            message: "Taskを削除し、関連するPlanとGoalの達成度を更新しました。",
            task: deletedTask,
            plan: finalUpdatedPlan,
            goal: finalUpdatedGoal,
        });
    }
    catch (error) {
        res.status(500).json({ message: "deleteTask Apiエラーです。", error });
        return;
    }
};
exports.deleteTask = deleteTask;
