import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { goalList } from "../../store/features/goal/goalSlice";

const Completed: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { goals } = useAppSelector((state) => state.goal);
  const completedGoal = goals.filter((goal) => goal.isCompleted);
  useEffect(() => {
    if (completedGoal) {
      dispatch(goalList());
    }
  }, [dispatch, accessToken]);
  return (
    <div>
      <ul>
        {completedGoal.map((goal) => (
          <li key={goal._id}>{goal.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Completed;
