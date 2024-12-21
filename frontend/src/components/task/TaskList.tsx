import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  deleteTask,
  getTaskById,
  taskList,
  updateTask,
} from "../../store/features/task/taskSlice";
import EditTask from "./EditTask";
import { ITask } from "../../types/task";

const TaskList: React.FC = () => {
  const { tasks } = useAppSelector((state) => state.task);
  const { selectedPlan } = useAppSelector((state) => state.plan);
  const dispatch = useAppDispatch();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      dispatch(taskList(selectedPlan._id));
    }
  }, [dispatch, selectedPlan]);

  const handleStatusClick = ({
    task,
    plan,
  }: {
    task: ITask;
    plan: { _id: string };
  }) => {
    const nextStatus =
      task.status === "未着手"
        ? "進行中"
        : task.status === "進行中"
        ? "完了"
        : "未着手";

    const updatedStatus = { ...task, status: nextStatus };
    dispatch(getTaskById({ taskId: task._id, planId: plan._id }));
    dispatch(
      updateTask({
        taskId: task._id,
        planId: plan._id,
        taskData: updatedStatus,
      })
    );
  };

  const handelTaskClick = ({
    taskId,
    planId,
  }: {
    taskId: string;
    planId: string;
  }) => {
    dispatch(getTaskById({ taskId, planId }));
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
    <div>
      <ul>
        {tasks.map((task) =>
          editingTaskId === task._id ? (
            <li key={task._id}>
              <EditTask task={task} onCancel={handelCancelTask} />
            </li>
          ) : (
            <li key={task._id} className="bg-white">
              <button
                onClick={() =>
                  handelTaskClick({ taskId: task._id, planId: task.plan_id })
                }
              >
                {task.title}
              </button>
              <div>
                <button onClick={() => handelEditClick(task._id)}>Edit</button>
                <button onClick={() => handelDeleteTask(task._id)}>
                  Delete
                </button>
              </div>
              <p>{task.description}</p>
              <p>
                Status:
                <button
                  onClick={() =>
                    handleStatusClick({ task, plan: { _id: task.plan_id } })
                  }
                >
                  {task.status}
                </button>
              </p>
              <p>
                {task.startDate.split("T")[0]} - {task.finishDate.split("T")[0]}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default TaskList;
