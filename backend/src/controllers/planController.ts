import { Request, Response } from "express";
import Plan from "../models/Plan";
import Goal from "../models/Goal";
import Task from "../models/Task";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      goal_id,
      task_id,
    } = req.body;
    const user = req.user?.id;

    if (!user) {
      res.status(400).json({ message: "ユーザーが見つかりません。" });
      return;
    }

    const findGoal = await Goal.findById(goal_id);

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
        .json({ message: "finishDateをstartDateより後に設定してください。" });
      return;
    }

    const newPlan = new Plan({
      title,
      description,
      status,
      startDate: new Date(startDate),
      finishDate: new Date(finishDate),
      createdBy: user,
      goal_id: findGoal,
      task_id,
    });

    await newPlan.save();

    findGoal.plan_id.push(newPlan.id);
    await findGoal.save();

    res.status(200).json({ newPlan });
  } catch (error) {
    res.status(500).json({ message: "createPlan Apiエラーです" });
    return;
  }
};

export const getsPlan = async (req: Request, res: Response) => {
  try {
    // const user = req.user?.id;
    const goalId = req.params.id;

    if (!goalId) {
      res.status(400).json({ message: "goalを見つかりません。" });
      return;
    }

    const plans = await Plan.find({ goal_id: goalId });
    res.status(200).json(plans || []);
  } catch (error) {
    res.status(500).json({ message: "getsPlan Apiエラーです。", error });
    return;
  }
};

export const getPlan = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
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

    const plan = await Plan.findOne({
      _id: planId,
      goal_id: goalId,
      createdBy: user,
    });

    if (!plan) {
      res.status(400).json({ message: "planが見つかりません。" });
      return;
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "getPlan Apiエラーです。", error });
    return;
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const {
      title,
      description,
      status,
      startDate,
      finishDate,
      task_id,
      goal_id,
    } = req.body;
    const goalId = req.params.id;
    const planId = req.params.planId;

    const plan = await Plan.findOne({ goal_id: goalId, _id: planId });

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
        .json({ message: "finishDateをstartDateより後に設定してください。" });
      return;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      {
        title,
        description,
        status,
        startDate: new Date(startDate),
        finishDate: new Date(finishDate),
        task_id,
        goal_id,
      },
      { new: true }
    );

    if (!updatedPlan) {
      res.status(404).json({ message: "planの更新に失敗しました。" });
      return;
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "updatePlan Apiエラーです。", error });
    return;
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const planId = req.params.id;

    const plan = await Plan.findOne({
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

    const tasks = await Task.find({ plan_id: planId });
    const taskIds = tasks.map((task) => task._id);
    await Task.deleteMany({ plan_id: planId });

    const deletedPlan = await Plan.findByIdAndDelete(planId);
    if (!deletedPlan) {
      res.status(400).json({ message: "plan削除に失敗しました。" });
      return;
    }

    await Goal.findByIdAndUpdate(deletedPlan.goal_id, {
      $pull: {
        plan_id: planId,
        task_id: { $in: taskIds },
      },
    });

    res.status(200).json({ message: "planを削除しました。" });
  } catch (error) {
    res.status(500).json({ message: "updatePlan Apiエラーです。", error });
    return;
  }
};
