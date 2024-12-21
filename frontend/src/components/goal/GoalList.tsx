import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  deleteGoal,
  getGoalById,
  goalList,
  updateGoal,
} from "../../store/features/goal/goalSlice";
import { IGoal } from "../../types/goal";
import EditGoal from "./EditGoal";

const GoalList: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const { selectedGoal } = useAppSelector((state) => state.goal);
  const dispatch = useAppDispatch();
  const { goals, loading, error } = useAppSelector((state) => state.goal);

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      dispatch(goalList());
    }
  }, [dispatch, accessToken]);

  const handleStatusClick = (goal: IGoal) => {
    const nextStatus =
      goal.status === "未着手"
        ? "進行中"
        : goal.status === "進行中"
        ? "完了"
        : "未着手";

    const updatedStatus = { ...goal, status: nextStatus };
    dispatch(getGoalById(goal._id));
    dispatch(updateGoal({ id: goal._id, goalData: updatedStatus }));
  };

  const handelEditClick = (goalId: string) => {
    setEditingGoalId(goalId);
  };

  const handleGoalClick = (goalId: string) => {
    dispatch(getGoalById(goalId));
  };

  const handelDeleteGoal = (goalId: string) => {
    dispatch(deleteGoal(goalId));
  };

  const handelCancelEdit = () => {
    setEditingGoalId(null);
  };

  return (
    <>
      <div className="my-2">
        <ul>
          {goals.map((goal) =>
            editingGoalId === goal._id ? (
              <li key={goal._id}>
                <EditGoal goal={goal} onCancel={handelCancelEdit} />
              </li>
            ) : (
              <li key={goal._id} className="my-4 p-5 bg-white">
                <div className="flex justify-between mb-1">
                  <button
                    className={`text-2xl hover:bg-yellow-400 hover:text-black rounded-md ${
                      selectedGoal?._id === goal._id &&
                      "bg-amber-700 text-white rounded-md"
                    }`}
                    onClick={() => handleGoalClick(goal._id)}
                  >
                    {goal.title}
                  </button>
                  <div className="flex space-x-4 items-center">
                    <button onClick={() => handelEditClick(goal._id)}>
                      Edit
                    </button>
                    <button onClick={() => handelDeleteGoal(goal._id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p>{goal.description}</p>
                <div className="flex ">
                  <p>
                    Status:{" "}
                    <button onClick={() => handleStatusClick(goal)}>
                      {goal.status}
                    </button>
                  </p>
                  <button>Completed</button>
                </div>
                <p>
                  {goal.startDate.split("T")[0]} /{" "}
                  {goal.finishDate.split("T")[0]}
                </p>
              </li>
            )
          )}
        </ul>
        {error}
      </div>
    </>
  );
};

export default GoalList;
