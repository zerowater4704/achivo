import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  deleteTask,
  taskList,
  updateTask,
} from "../../store/features/task/taskSlice";
import EditTask from "./EditTask";
import { ITask } from "../../types/task";
import { AnimatePresence, motion } from "framer-motion";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import RemainingDays from "../RemainingDays";
import LoadingSpinner from "../LoadingSpinner";

const TaskList: React.FC = () => {
  const { tasks, loading } = useAppSelector((state) => state.task);
  const { selectedPlan } = useAppSelector((state) => state.plan);
  const dispatch = useAppDispatch();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      dispatch(taskList(selectedPlan._id));
    }
  }, [dispatch, selectedPlan]);

  const handleStatusClick = (task: ITask) => {
    const nextStatus = !task.isCompleted;

    const updatedCompleted = { ...task, isCompleted: nextStatus };

    dispatch(
      updateTask({
        taskId: task._id,
        planId: task.plan_id,
        taskData: updatedCompleted,
      })
    ).then(() => {
      if (selectedPlan) {
        dispatch(taskList(selectedPlan._id));
      }
    });
  };

  const handelEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handelCancelTask = () => {
    setEditingTaskId(null);
  };

  const handelDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className="my-2 p-2 bg-slate-100 shadow-md rounded-md">
      {tasks.length === 0 && (
        <div className="text-center text-lg">まだタスクがありません。</div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul>
          <AnimatePresence>
            {tasks.map((task) =>
              editingTaskId === task._id ? (
                <li key={task._id}>
                  <EditTask task={task} onCancel={handelCancelTask} />
                </li>
              ) : (
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={task._id}
                  className="my-4 p-5 bg-white shadow-md rounded-md font-sans"
                >
                  <div className="flex justify-between mb-1">
                    <h2 className="text-2xl font-semibold pr-2">
                      {task.title}
                    </h2>
                    <div className="flex space-x-4 items-center">
                      <button onClick={() => handelEditClick(task._id)}>
                        <FaEdit className=" text-2xl" />
                      </button>
                      <button onClick={() => handelDeleteTask(task._id)}>
                        <MdDeleteForever className=" text-2xl" />
                      </button>
                    </div>
                  </div>
                  <p className="my-3">{task.description}</p>
                  <p className="mb-2">
                    <span>進行中: </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      onClick={() => handleStatusClick(task)}
                    >
                      {task.isCompleted ? (
                        <p>
                          <span className="text-lg">🥳</span>完了
                        </p>
                      ) : (
                        <p>未完了</p>
                      )}
                    </motion.button>
                  </p>
                  <div className="flex justify-between">
                    <p>
                      {task.startDate.split("T")[0]} -{" "}
                      {task.finishDate.split("T")[0]}
                    </p>
                    <p>
                      <RemainingDays finishDate={task.finishDate} />
                    </p>
                  </div>
                </motion.li>
              )
            )}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default TaskList;
