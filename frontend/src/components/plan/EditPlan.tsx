import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PlanFormInput, UpdatePlanProps } from "../../types/plan";
import { updatePlan } from "../../store/features/plan/planSlice";
import InputForm from "../InputForm";

const EditPlan: React.FC<UpdatePlanProps> = ({ plan, onCancel }) => {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.plan);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormInput>({
    defaultValues: {
      title: plan.title,
      description: plan.description,
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
      <InputForm
        label="タイトル"
        type="text"
        {...register("title", { required: "必須項目です。" })}
      />
      {errors.title && <p>{errors.title.message}</p>}
      <InputForm
        label="詳細"
        type="text"
        {...register("description", { required: "必須項目です。" })}
      />
      {errors.description && <p>{errors.description.message}</p>}
      <InputForm
        label="開始日"
        type="date"
        {...register("startDate", { required: "必須項目です。" })}
      />
      {errors.startDate && <p>{errors.startDate.message}</p>}
      <InputForm
        label="終了日"
        type="date"
        {...register("finishDate", { required: "必須項目です。" })}
      />
      {errors.finishDate && <p>{errors.finishDate.message}</p>}

      {error && <p className=" text-red-600">{error}</p>}
      <div className=" my-2 flex justify-end space-x-4">
        <button type="submit" className="transform active:translate-y-1">
          {loading ? "編集中..." : "編集"}
        </button>
        <button onClick={onCancel} className="pr-3 active:translate-y-1">
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default EditPlan;
