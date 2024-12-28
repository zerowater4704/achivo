import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITask, TaskFormInput, TaskState } from "../../../types/task";
import axios from "axios";
import { PlanState } from "../../../types/plan";
import axiosInstance from "../../../hooks/useAxios";
import { GoalState } from "../../../types/goal";
import { ErrorResponse } from "../../../types/task";

const initialState: TaskState = {
  tasks: [],
  selectedPlan: null,
  selectedTask: null,
  isCompleted: false,
  loading: false,
  error: null,
  planId: null,
};

export const createTask = createAsyncThunk<
  ITask,
  TaskFormInput,
  { rejectValue: ErrorResponse }
>("task/create", async (taskData, { getState, rejectWithValue }) => {
  const planState = getState() as { plan: PlanState };
  const goalState = getState() as { goal: GoalState };
  const planId = planState.plan.selectedPlan;
  const goalId = goalState.goal.selectedGoal;

  if (!planId) {
    return rejectWithValue({ message: "計画を選択してください。" });
  }

  if (!goalId) {
    return rejectWithValue({ message: "目標を選択してください。" });
  }
  try {
    const response = await axiosInstance.post("task/create", {
      ...taskData,
      goal_id: goalId?._id,
      plan_id: planId._id,
    });

    return response.data.task;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const taskList = createAsyncThunk<
  ITask[],
  string,
  { rejectValue: ErrorResponse }
>("task/taskList", async (planId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`task/tasks/${planId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const getTaskById = createAsyncThunk<
  ITask,
  { planId: string; taskId: string },
  { rejectValue: ErrorResponse }
>("task/getTaskById", async ({ planId, taskId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`task/tasks/${planId}/${taskId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const updateTask = createAsyncThunk<
  ITask,
  { planId: string; taskId: string; taskData: Partial<ITask> },
  { rejectValue: ErrorResponse }
>(
  "task/updateTask",
  async ({ planId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `task/tasks/${planId}/${taskId}`,
        taskData
      );
      return response.data.task;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data as ErrorResponse);
      } else {
        return rejectWithValue({ message: "予期しないエラーが発生しました。" });
      }
    }
  }
);

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>("task/deleteTask", async (taskId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`task/tasks/${taskId}`);
    return taskId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetSelectedTask(state) {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(taskList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(taskList.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(taskList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.loading = false;
        console.log("Updated Task:", action.payload);
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );

        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        if (state.selectedTask?._id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      });
  },
});

export const { resetSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
