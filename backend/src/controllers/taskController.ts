import { Request, Response } from "express";
import Plan from "../models/Plan";
import Goal from "../models/Goal";
import Task from "../models/Task";

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      goal_id,
      plan_id,
    } = req.body;
    const user = req.user?.id;

    if (!user) {
      res.status(400).json({ message: "ユーザーが見つかりません。" });
      return;
    }
    const findGoal = await Goal.findById(goal_id);
    const findPlan = await Plan.findById(plan_id);

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

    const newTask = new Task({
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
  } catch (error) {
    res.status(500).json({ message: "createTask Apiエラーです。" });
    return;
  }
};

export const getsTask = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id;

    if (!planId) {
      res.status(400).json({ message: "goalを見つかりません。" });
      return;
    }

    const tasks = await Task.find({ plan_id: planId });

    res.status(200).json(tasks || []);
  } catch (error) {
    res.status(500).json({ message: "getsTask Apiエラーです。", error });
    return;
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
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

    const task = await Task.findOne({
      _id: taskId,
      plan_id: planId,
      createdBy: user,
    });

    if (!task) {
      res.status(400).json({ message: "taskが見つかりません。" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "getTask Apiエラーです。", error });
    return;
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      plan_id,
      goal_id,
    } = req.body;

    const taskId = req.params.taskId;
    const planId = req.params.id;

    const task = await Task.findOne({ _id: taskId, plan_id: planId });

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

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        startDate: new Date(startDate),
        finishDate: new Date(finishDate),
        plan_id,
        goal_id,
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "planの更新に失敗しました。" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "updateTask Apiエラーです。", error });
    return;
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ createdBy: user, _id: taskId });

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

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "taskを削除しました。" });
  } catch (error) {
    res.status(500).json({ message: "deleteTask Apiエラーです。", error });
    return;
  }
};
