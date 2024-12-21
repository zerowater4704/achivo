export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  finishDate: string;
  goal_id: string;
  plan_id: string;
}

export interface TaskState {
  tasks: ITask[];
  selectedTask: ITask | null;
  selectedPlan: ITask | null;
  loading: boolean;
  error: string | null;
  planId: string | null;
}

export interface ErrorResponse {
  message: string;
}

export interface TaskFormInput {
  title: string;
  description: string;
  status: string;
  startDate: string;
  finishDate: string;
  goal_id: string;
  plan_id: string;
}

export interface UpdateTaskProps {
  task: {
    _id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    finishDate: string;
    goal_id: string;
    plan_id: string;
  };
  onCancel: () => void;
}
