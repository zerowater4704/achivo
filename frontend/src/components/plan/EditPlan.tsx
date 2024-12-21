import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/hooks";
import { PlanFormInput, UpdatePlanProps } from "../../types/plan";
import { updatePlan } from "../../store/features/plan/planSlice";

const EditPlan: React.FC<UpdatePlanProps> = ({ plan, onCancel }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormInput>({
    defaultValues: {
      title: plan.title,
      description: plan.description,
      status: plan.status,
      startDate: plan.startDate,
      finishDate: plan.finishDate,
    },
  });

  const onSubmit: SubmitHandler<PlanFormInput> = async (data) => {
    dispatch(
      updatePlan({ planId: plan._id, goalId: plan.goal_id, planData: data })
    );
    onCancel();
  };
  return (
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
  );
};

export default EditPlan;
