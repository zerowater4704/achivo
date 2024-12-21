import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  deletePlan,
  getPlanById,
  planList,
  updatePlan,
} from "../../store/features/plan/planSlice";
import EditPlan from "./EditPlan";
import { IPlan } from "../../types/plan";

const PlanList: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const { plans, selectedPlan } = useAppSelector((state) => state.plan);
  const { selectedGoal } = useAppSelector((state) => state.goal);
  const dispatch = useAppDispatch();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGoal) {
      dispatch(planList(selectedGoal._id));
    }
  }, [dispatch, selectedGoal]);

  const handleStatusClick = ({
    plan,
    goal,
  }: {
    plan: IPlan;
    goal: { _id: string };
  }) => {
    const nextStatus =
      plan.status === "未着手"
        ? "進行中"
        : plan.status === "進行中"
        ? "完了"
        : "未着手";

    const updatedStatus = { ...plan, status: nextStatus };
    dispatch(getPlanById({ planId: plan._id, goalId: goal._id }));
    dispatch(
      updatePlan({
        planId: plan._id,
        goalId: goal._id,
        planData: updatedStatus,
      })
    );
  };

  const handelPlanClick = ({
    planId,
    goalId,
  }: {
    planId: string;
    goalId: string;
  }) => {
    dispatch(getPlanById({ goalId, planId }));
  };

  const handelEditClick = (planId: string) => {
    setEditingPlanId(planId);
  };

  const handelCancelEdit = () => {
    setEditingPlanId(null);
  };

  const handelDeletePlan = (planId: string) => {
    dispatch(deletePlan(planId));
  };

  return (
    <div>
      <ul>
        {plans.map((plan) =>
          editingPlanId === plan._id ? (
            <li key={plan._id}>
              <EditPlan plan={plan} onCancel={handelCancelEdit} />
            </li>
          ) : (
            <li key={plan._id} className="my-2 p-2 bg-white">
              <div className="flex justify-between">
                <button
                  className={`text-xl ${
                    selectedPlan?._id === plan._id && "bg-amber-500 text-white"
                  }`}
                  onClick={() =>
                    handelPlanClick({ planId: plan._id, goalId: plan.goal_id })
                  }
                >
                  {plan.title}
                </button>
                <div className="flex space-x-4 items-center">
                  <button onClick={() => handelEditClick(plan._id)}>
                    Edit
                  </button>
                  <button onClick={() => handelDeletePlan(plan._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <p>{plan.description}</p>
              <p>
                Status:
                <button
                  onClick={() =>
                    handleStatusClick({ plan, goal: { _id: plan.goal_id } })
                  }
                >
                  {plan.status}
                </button>
              </p>
              <p>
                {plan.startDate.split("T")[0]} - {plan.finishDate.split("T")[0]}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default PlanList;
