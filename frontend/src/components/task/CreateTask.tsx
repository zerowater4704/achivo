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
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const CreateTask: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const { selectedPlan } = useAppSelector((state) => state.plan);
  const { error, loading } = useAppSelector((state) => state.task);
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
      setIsModalOpen((prev) => !prev);
      setIsRotated((prev) => !prev);
      reset();
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen((prev) => !prev);
    setIsRotated((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen((prev) => !prev);
    setIsRotated((prev) => !prev);
    reset();
  };

  return (
    <>
      <div className="flex justify-between py-3 px-3 text-lg border-b-2 border-green-400">
        <p className="font-semibold">タスク</p>
        {selectedPlan && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 500 }}
            onClick={handleOpenModal}
          >
            <motion.span
              animate={{ rotate: isRotated ? 45 : 0 }}
              className=" block"
            >
              {" "}
              <FaPlus />
            </motion.span>
          </motion.button>
        )}
      </div>
      {isModalOpen ? (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.5 }}
        >
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
                {loading ? "タスク作成中..." : "タスク作成"}
              </button>
              <button
                onClick={handleCloseModal}
                className="pr-3 transform active:translate-y-1"
              >
                Close
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <>{selectedPlan && <TaskList />}</>
      )}
    </>
  );
};

export default CreateTask;
