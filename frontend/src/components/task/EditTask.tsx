import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/hooks";
import { TaskFormInput, UpdateTaskProps } from "../../types/task";
import { updateTask } from "../../store/features/task/taskSlice";

const EditTask: React.FC<UpdateTaskProps> = ({ task, onCancel }) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
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

export default EditTask;
