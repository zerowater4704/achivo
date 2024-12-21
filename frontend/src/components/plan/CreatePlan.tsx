import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PlanFormInput } from "../../types/plan";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  createPlan,
  resetSelectedPlan,
} from "../../store/features/plan/planSlice";
import InputForm from "../InputForm";
import PlanList from "./PlanList";

const CreatePlan: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedGoal } = useAppSelector((state) => state.goal);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormInput>({
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
    dispatch(resetSelectedPlan());
  }, [selectedGoal, dispatch, reset]);

  const onSubmit: SubmitHandler<PlanFormInput> = async (data) => {
    const result = await dispatch(createPlan(data)).unwrap();
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
      <div className="flex justify-between py-3 px-3 text-lg border-b-2 border-orange-400">
        <p className=" items-center">計画</p>
        {selectedGoal && (
          <button onClick={handleOpenModal} className="  ">
            Add Plan
          </button>
        )}
      </div>
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
        <>{selectedGoal && <PlanList />}</>
      )}
    </div>
  );
};

export default CreatePlan;
