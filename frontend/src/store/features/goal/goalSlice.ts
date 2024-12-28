import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IGoal,
  GoalState,
  ErrorResponse,
  GoalFormInputs,
} from "../../../types/goal";
import axios from "axios";
import axiosInstance from "../../../hooks/useAxios";

const initialState: GoalState = {
  goals: [],
  selectedGoal: null,
  progress: null,
  loading: false,
  error: null,
};

export const createGoal = createAsyncThunk<
  IGoal, // ReturnedType: サーバーから返される完全なデータ型
  GoalFormInputs,
  // ThunkArg: サーバーに送信するデータ型
  { rejectValue: ErrorResponse } // ThunkApiConfig: エラーレスポンス型
>("goal/create", async (goalData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`api/goal/create`, goalData);
    return response.data.newGoal;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const goalList = createAsyncThunk<
  IGoal[], // サーバーから返される型（ゴールの配列）
  void, // サーバーからデータを取得するだけなので、特に引数が必要ない
  { rejectValue: ErrorResponse }
>("goal/goalList", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("api/goal/goals");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const getGoalById = createAsyncThunk<
  IGoal, // サーバーから返される型（1つのゴール）
  string, // ゴールのID（サーバーに送信するデータ）
  { rejectValue: ErrorResponse }
>("goal/getGoalById", async (goalId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`api/goal/goals/${goalId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const updateGoal = createAsyncThunk<
  IGoal, // サーバーから返される型（更新されたゴール)
  { id: string; goalData: Partial<IGoal> }, // サーバーに送信するデータの型（IDと更新内容,更新した部分だけを送る）
  { rejectValue: ErrorResponse }
>("goal/updateGOal", async ({ id, goalData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`api/goal/goals/${id}`, goalData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const deleteGoal = createAsyncThunk<
  string, // サーバーから返される型（削除されたゴールのID）
  string, // サーバーに送信するデータの型（削除対象のゴールID）
  { rejectValue: ErrorResponse }
>("goal/deleteGoal", async (goalId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`api/goal/goals/${goalId}`);
    return goalId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

const goalSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(goalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(goalList.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(goalList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(getGoalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoalById.fulfilled, (state, action: PayloadAction<IGoal>) => {
        state.loading = false;
        state.selectedGoal = action.payload;
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<IGoal>) => {
        state.loading = false;
        state.goals = state.goals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        );

        if (state.selectedGoal?._id === action.payload._id) {
          state.selectedGoal = action.payload;
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.goals = state.goals.filter((goal) => goal._id !== action.payload);
        if (state.selectedGoal?._id === action.payload) {
          state.selectedGoal = null;
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      });
  },
});

export const { resetError } = goalSlice.actions;
export default goalSlice.reducer;
