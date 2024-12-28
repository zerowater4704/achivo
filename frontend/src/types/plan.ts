export interface IPlan {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  progress: number;
  startDate: string;
  finishDate: string;
  goal_id: string;
  task_id: string[];
}

export interface PlanState {
  plans: IPlan[];
  selectedGoal: IPlan | null;
  selectedPlan: IPlan | null;
  progress: number | null;
  isCompleted: boolean;
  loading: boolean;
  error: string | null;
  goalId: string | null;
}

export interface ErrorResponse {
  message: string;
}

export interface PlanFormInput {
  title: string;
  description: string;
  startDate: string;
  finishDate: string;
  goal_id: string;
  task_id: string[];
}

export interface UpdatePlanProps {
  plan: {
    _id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    progress: number;
    startDate: string;
    finishDate: string;
    goal_id: string;
  };
  onCancel: () => void;
}
