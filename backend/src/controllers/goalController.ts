import { Request, Response } from "express";
import Goal from "../models/Goal";
import Plan from "../models/Plan";
import Task from "../models/Task";

export const createGoal = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      plan_id,
      task_id,
    } = req.body;

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
        .json({ message: "finishDateをstartDateより後に設定してください。" });
      return;
    }

    const newGoal = new Goal({
      title,
      description,
      status,
      startDate: new Date(startDate),
      finishDate: new Date(finishDate),
      createdBy: user,
      plan_id,
      task_id,
    });

    await newGoal.save();
    res.status(200).json({ newGoal });
  } catch (error) {
    res.status(500).json({ message: "createGoal Apiエラーです。", error });
    return;
  }
};

export const getsGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user?.id;

    if (!user) {
      res.status(400).json({ message: "ユーザーを見つかりません。" });
      return;
    }

    const goals = await Goal.find({ createdBy: user });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "getsGoal Apiエラーです", error });
  }
};

export const getGoal = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const goalId = req.params.id;

    if (!user) {
      res.status(400).json({ message: "ユーザーを見つかりません。" });
      return;
    }

    const getGoal = await Goal.findOne({ _id: goalId, createdBy: user });
    if (!getGoal) {
      res.status(400).json({ message: "goalがありません。" });
      return;
    }

    res.status(200).json(getGoal);
  } catch (error) {
    res.status(500).json({ message: "getGoal Apiのエラーです。", error });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const goalId = req.params.id;
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      plan_id,
      task_id,
    } = req.body;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      res.status(400).json({ message: "goalを見つかりません。" });
      return;
    }

    if (goal.createdBy.toString() !== user) {
      res.status(400).json({ message: "更新する権限がありません。" });
      return;
    }

    if (
      finishDate &&
      startDate &&
      new Date(finishDate) <= new Date(startDate)
    ) {
      res
        .status(400)
        .json({ message: "finishDateをstartDateより後に設定してください。" });
      return;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      {
        title,
        description,
        status,
        startDate: new Date(startDate),
        finishDate: new Date(finishDate),
        plan_id,
        task_id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      res.status(404).json({ message: "ゴールの更新に失敗しました。" });
      return;
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "updateGoal Apiエラーです。", error });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const goalId = req.params.id;

    const goal = await Goal.findOne({
      createdBy: user,
      _id: goalId,
    });

    if (!goal) {
      res.status(400).json({ message: "goalがありません。" });
      return;
    }

    await Plan.deleteMany({ goal_id: goalId });
    await Task.deleteMany({ goal_id: goalId });

    await goal.deleteOne();

    res.status(200).json({ message: "goalを削除しました。" });
  } catch (error) {
    res.status(500).json({ message: "deleteGoal Apiエラーです。" });
  }
};
