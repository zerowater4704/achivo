export interface IGoal {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  finishDate: string;
  plan_id: string[];
  task_id: string[];
}

export interface GoalState {
  goals: IGoal[];
  selectedGoal: IGoal | null;
  loading: boolean;
  error: string | null;
}

export interface ErrorResponse {
  message: string;
}

export interface GoalFormInputs {
  title: string;
  description: string;
  status: string;
  startDate: string;
  finishDate: string;
  plan_id: string[];
  task_id: string[];
}

export interface UpdateGoalProps {
  goal: {
    _id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    finishDate: string;
  };
  onCancel: () => void;
}
