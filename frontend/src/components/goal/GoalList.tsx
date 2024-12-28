import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  deleteGoal,
  getGoalById,
  goalList,
  updateGoal,
} from "../../store/features/goal/goalSlice";
import { IGoal } from "../../types/goal";
import EditGoal from "./EditGoal";
import { ProgressBar } from "../ProgressBar";
import { useNavigate } from "react-router-dom";
import RemainingDays from "../RemainingDays";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const GoalList: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { goals, error, selectedGoal } = useAppSelector((state) => state.goal);
  const { plans } = useAppSelector((state) => state.plan);
  const { tasks } = useAppSelector((state) => state.task);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      dispatch(goalList());
    }
  }, [dispatch, accessToken, tasks, plans]);

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

  const handelCompletedClick = (goals: IGoal) => {
    const nextStatus = !goals.isCompleted;
    const updatedCompleted = { ...goals, isCompleted: nextStatus };
    dispatch(updateGoal({ id: goals._id, goalData: updatedCompleted }));
    navigate("/completed");
  };

  return (
    <>
      <div className="my-2 p-2 bg-slate-100 shadow-md rounded-md">
        {goals.length === 0 && (
          <div className="text-center text-lg">
            ここに目標を追加して進捗を管理しましょう
          </div>
        )}
        <ul>
          <AnimatePresence>
            {goals.map((goal) =>
              editingGoalId === goal._id ? (
                <li key={goal._id}>
                  <EditGoal goal={goal} onCancel={handelCancelEdit} />
                </li>
              ) : (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  key={goal._id}
                  className="my-4 p-5 bg-white shadow-md rounded-md font-sans"
                >
                  <div className="flex justify-between mb-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className={`text-2xl font-semibold ${
                        selectedGoal?._id === goal._id &&
                        " border-b-2 border-indigo-700"
                      }`}
                      onClick={() => handleGoalClick(goal._id)}
                    >
                      <h2 className="pr-2">{goal.title}</h2>
                    </motion.button>
                    <div className="flex space-x-4 items-center">
                      <button onClick={() => handelEditClick(goal._id)}>
                        <FaEdit className=" text-2xl" />
                      </button>
                      <button onClick={() => handelDeleteGoal(goal._id)}>
                        <MdDeleteForever className=" text-2xl" />
                      </button>
                    </div>
                  </div>
                  <p className="my-3">{goal.description}</p>
                  <div className="flex justify-between items-center">
                    <p>
                      進行中:{" "}
                      <span className="font-medium text-lg">
                        {goal.progress}%
                      </span>
                    </p>
                    <p>
                      {goal.progress === 100 && (
                        <button onClick={() => handelCompletedClick(goal)}>
                          <span className="text-xl">🎊</span> Completed
                        </button>
                      )}
                    </p>
                  </div>
                  <ProgressBar progress={goal.progress} />
                  <div className="flex justify-between">
                    <p>
                      {goal.startDate.split("T")[0]} -{" "}
                      {goal.finishDate.split("T")[0]}
                    </p>
                    {goal.progress === 100 ? (
                      ""
                    ) : (
                      <p>
                        <RemainingDays finishDate={goal.finishDate} />
                      </p>
                    )}
                  </div>
                </motion.li>
              )
            )}
          </AnimatePresence>
        </ul>
        {error}
      </div>
    </>
  );
};

export default GoalList;
