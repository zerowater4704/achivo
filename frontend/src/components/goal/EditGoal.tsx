import { useAppDispatch } from "../../hooks/hooks";
import { GoalFormInputs } from "../../types/goal";
import { UpdateGoalProps } from "../../types/goal";
import { updateGoal } from "../../store/features/goal/goalSlice";
import { useForm, SubmitHandler } from "react-hook-form";

const EditGoal: React.FC<UpdateGoalProps> = ({ goal, onCancel }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormInputs>({
    defaultValues: {
      title: goal.title,
      description: goal.description,
      status: goal.status,
      startDate: goal.startDate,
      finishDate: goal.finishDate,
    },
  });

  const onSubmit: SubmitHandler<GoalFormInputs> = async (data) => {
    dispatch(updateGoal({ id: goal._id, goalData: data }));
    onCancel();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mb-1">
          <div className=" space-x-3">
            <label className="text-xl">Title:</label>
            <input type="text" {...register("title", { required: "" })} />
          </div>
          <div className=" space-x-4 items-center">
            <button type="submit">Save</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
        <input type="text" {...register("description", { required: "" })} />

        <div>
          <label>Status</label>
          <select {...register("status")}>
            <option value="未着手">未着手</option>
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
          </select>
        </div>

        <input
          type="date"
          {...register("startDate", { required: "" })}
          className="block"
        />
        <input
          type="date"
          {...register("finishDate", { required: "" })}
          className="block"
        />
      </form>
    </>
  );
};

export default EditGoal;
