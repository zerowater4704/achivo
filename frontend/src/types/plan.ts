export interface IPlan {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  finishDate: string;
  goal_id: string;
  task_id: string[];
}

export interface PlanState {
  plans: IPlan[];
  selectedGoal: IPlan | null;
  selectedPlan: IPlan | null;
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
  status: string;
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
    status: string;
    startDate: string;
    finishDate: string;
    goal_id: string;
  };
  onCancel: () => void;
}
