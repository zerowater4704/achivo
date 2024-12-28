import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { TaskFormInput, UpdateTaskProps } from "../../types/task";
import { updateTask } from "../../store/features/task/taskSlice";
import InputForm from "../InputForm";

const EditTask: React.FC<UpdateTaskProps> = ({ task, onCancel }) => {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.task);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput>({
    defaultValues: {
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      finishDate: task.finishDate,
    },
  });

  const onSubmit: SubmitHandler<TaskFormInput> = async (data) => {
    dispatch(
      updateTask({ taskId: task._id, planId: task.plan_id, taskData: data })
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

export default EditTask;
