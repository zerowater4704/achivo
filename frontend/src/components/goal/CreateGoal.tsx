import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { createGoal } from "../../store/features/goal/goalSlice";
import InputForm from "../InputForm";
import GoalList from "./GoalList";
import { GoalFormInputs } from "../../types/goal";

const CreateGoal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      status: "未着手",
      startDate: "",
      finishDate: "",
      plan_id: [],
      task_id: [],
    },
  });

  const onSubmit: SubmitHandler<GoalFormInputs> = async (data) => {
    const result = await dispatch(createGoal(data)).unwrap();
    if (result) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex border-b-2 border-blue-400 py-3 px-3 text-lg justify-between items-center">
        目標
        <button onClick={handleOpenModal} className="  ">
          Add Goal
        </button>
      </div>
      {!isModalOpen ? (
        <GoalList />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            label="Title"
            type="text"
            {...register("title", { required: "" })}
          />
          <InputForm
            label="Description"
            type="text"
            {...register("description", { required: "" })}
          />

          <div>
            <label>Status</label>
            <select {...register("status")}>
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
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Create Goal..." : "Create Goal"}
          </button>
          <button onClick={handleCloseModal}>Close</button>
        </form>
      )}
    </>
  );
};

export default CreateGoal;
