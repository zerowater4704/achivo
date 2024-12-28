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
import { ProgressBar } from "../ProgressBar";
import RemainingDays from "../RemainingDays";
import { AnimatePresence, motion } from "framer-motion";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PlanList: React.FC = () => {
  const { plans, selectedPlan } = useAppSelector((state) => state.plan);
  const { tasks } = useAppSelector((state) => state.task);
  const { selectedGoal } = useAppSelector((state) => state.goal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGoal) {
      dispatch(planList(selectedGoal._id));
    }
  }, [dispatch, selectedGoal, tasks]);

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

  const handelCompletedClick = (plans: IPlan) => {
    const nextStatus = !plans.isCompleted;
    const updatedCompleted = { ...plans, isCompleted: nextStatus };
    dispatch(
      updatePlan({
        planId: plans._id,
        goalId: plans.goal_id,
        planData: updatedCompleted,
      })
    );
    navigate("/completed");
  };

  return (
    <div className="my-2 p-2 bg-slate-100 shadow-md rounded-md">
      {plans.length === 0 && (
        <div className="text-center text-lg">まだ計画がありません。</div>
      )}
      <ul>
        <AnimatePresence>
          {plans.map((plan) =>
            editingPlanId === plan._id ? (
              <li key={plan._id}>
                <EditPlan plan={plan} onCancel={handelCancelEdit} />
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
                transition={{ duration: 0.5 }}
                key={plan._id}
                className="my-4 p-5 bg-white shadow-md rounded-md font-sans"
              >
                <div className="flex justify-between mb-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className={`text-2xl font-semibold ${
                      selectedPlan?._id === plan._id &&
                      "border-b-2 border-yellow-700"
                    }`}
                    onClick={() =>
                      handelPlanClick({
                        planId: plan._id,
                        goalId: plan.goal_id,
                      })
                    }
                  >
                    <h2 className="pr-2">{plan.title}</h2>
                  </motion.button>
                  <div className="flex space-x-4 items-center">
                    <button onClick={() => handelEditClick(plan._id)}>
                      <FaEdit className=" text-2xl" />
                    </button>
                    <button onClick={() => handelDeletePlan(plan._id)}>
                      <MdDeleteForever className=" text-2xl" />
                    </button>
                  </div>
                </div>
                <p className="my-3">{plan.description}</p>
                <div className="flex justify-between">
                  <p>
                    <span>進行中: </span>
                    {plan.progress}%
                  </p>
                  <p>
                    {plan.progress === 100 && (
                      <button onClick={() => handelCompletedClick(plan)}>
                        <span className="text-xl">🎊</span>Completed
                      </button>
                    )}
                  </p>
                </div>
                <ProgressBar progress={plan.progress} />
                <div className="flex justify-between">
                  <p>
                    {plan.startDate.split("T")[0]} -{" "}
                    {plan.finishDate.split("T")[0]}
                  </p>
                  <p>
                    <RemainingDays finishDate={plan.finishDate} />
                  </p>
                </div>
              </motion.li>
            )
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default PlanList;
