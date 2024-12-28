import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { GoalFormInputs } from "../../types/goal";
import { UpdateGoalProps } from "../../types/goal";
import { updateGoal } from "../../store/features/goal/goalSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import InputForm from "../InputForm";

const EditGoal: React.FC<UpdateGoalProps> = ({ goal, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.goal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormInputs>({
    defaultValues: {
      title: goal.title,
      description: goal.description,
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
    </>
  );
};

export default EditGoal;
