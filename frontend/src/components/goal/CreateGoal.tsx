import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { createGoal } from "../../store/features/goal/goalSlice";
import InputForm from "../InputForm";
import GoalList from "./GoalList";
import { GoalFormInputs } from "../../types/goal";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const CreateGoal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.goal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      finishDate: "",
      plan_id: [],
    },
  });

  const onSubmit: SubmitHandler<GoalFormInputs> = async (data) => {
    const result = await dispatch(createGoal(data)).unwrap();
    if (result) {
      reset();
      setIsModalOpen((prev) => !prev);
      setIsRotated((prev) => !prev);
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
      <div className="flex border-b-2 border-blue-400 py-3 px-3 text-lg justify-between items-center font-zen font-semibold">
        目標
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500 }}
          onClick={handleOpenModal}
          className="  "
        >
          <motion.span
            animate={{ rotate: isRotated ? 45 : 0 }}
            className="block"
          >
            {" "}
            <FaPlus />
          </motion.span>
        </motion.button>
      </div>

      <AnimatePresence>
        {!isModalOpen ? (
          <GoalList />
        ) : (
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
                <button
                  type="submit"
                  className="transform active:translate-y-1"
                >
                  {loading ? "目標作成中..." : "目標作成"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="pr-3 transform active:translate-y-1"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateGoal;
