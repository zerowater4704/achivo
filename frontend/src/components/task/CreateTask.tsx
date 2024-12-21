import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { TaskFormInput } from "../../types/task";
import { useEffect, useState } from "react";
import {
  createTask,
  resetSelectedTask,
} from "../../store/features/task/taskSlice";
import InputForm from "../InputForm";
import TaskList from "./TaskList";

const CreateTask: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedPlan } = useAppSelector((state) => state.plan);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInput>({
    defaultValues: {
      title: "",
      description: "",
      status: "未着手",
      startDate: "",
      finishDate: "",
    },
  });

  useEffect(() => {
    setIsModalOpen(false);
    reset();
    dispatch(resetSelectedTask());
  }, [selectedPlan, dispatch, reset]);

  const onSubmit: SubmitHandler<TaskFormInput> = async (data) => {
    const result = await dispatch(createTask(data)).unwrap();
    if (result) {
      setIsModalOpen(false);
      reset();
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div>
      <p>タスク</p>
      {isModalOpen ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            type="text"
            label="Title"
            {...register("title", { required: "" })}
          />
          <InputForm
            type="text"
            label="Description"
            {...register("description", { required: "" })}
          />

          <div>
            <label className="block py-2 px-3">
              Status <span className=" text-red-600 text-sm pl-1">*必須</span>
            </label>
            <select
              {...register("status")}
              className=" bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-yellow-500 focus:border-yellow-500 block"
            >
              <option value="未着手">未着手</option>
              <option value="進行中">進行中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          <InputForm
            label="Start Date"
            type="date"
            {...register("startDate", { required: "" })}
          />
          <InputForm
            label="Finish Date"
            type="date"
            {...register("finishDate", { required: "" })}
          />

          <button type="submit">Create Plan</button>
          <button onClick={handleCloseModal}>Close</button>
        </form>
      ) : (
        <>
          {selectedPlan && (
            <div>
              <button onClick={handleOpenModal}>Add Task</button>
              <TaskList />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateTask;
