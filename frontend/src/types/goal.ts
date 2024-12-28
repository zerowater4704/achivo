export interface IGoal {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  progress: number;
  startDate: string;
  finishDate: string;
  plan_id: string[];
}

export interface GoalState {
  goals: IGoal[];
  selectedGoal: IGoal | null;
  progress: number | null;
  loading: boolean;
  error: string | null;
}

export interface ErrorResponse {
  message: string;
}

export interface GoalFormInputs {
  title: string;
  description: string;
  startDate: string;
  finishDate: string;
  plan_id: string[];
}

export interface UpdateGoalProps {
  goal: {
    _id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    progress: number;
    startDate: string;
    finishDate: string;
  };
  onCancel: () => void;
}
