import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../hooks/useAxios";
import {
  IPlan,
  PlanFormInput,
  PlanState,
  ErrorResponse,
} from "../../../types/plan";
import { GoalState } from "../../../types/goal";

const initialState: PlanState = {
  plans: [],
  selectedGoal: null,
  selectedPlan: null,
  progress: null,
  isCompleted: false,
  loading: false,
  error: null,
  goalId: null,
};

export const createPlan = createAsyncThunk<
  IPlan,
  PlanFormInput,
  { rejectValue: ErrorResponse }
>("plan/create", async (planData, { getState, rejectWithValue }) => {
  const state = getState() as { goal: GoalState }; //Reduxストアの現在の状態を取得
  const goalId = state.goal.selectedGoal;

  if (!goalId) {
    return rejectWithValue({ message: "目標を選択せいてください" });
  }
  try {
    const response = await axiosInstance.post("plan/create", {
      ...planData,
      goal_id: goalId._id,
    });
    return response.data.newPlan;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const planList = createAsyncThunk<
  IPlan[],
  string,
  { rejectValue: ErrorResponse }
>("plan/planList", async (goalId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`plan/plans/${goalId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const getPlanById = createAsyncThunk<
  IPlan,
  { planId: string; goalId: string },
  { rejectValue: ErrorResponse }
>("plan/getPlanById", async ({ planId, goalId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`plan/plans/${goalId}/${planId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const updatePlan = createAsyncThunk<
  IPlan,
  { planId: string; goalId: string; planData: Partial<IPlan> },
  { rejectValue: ErrorResponse }
>(
  "plan/updatePlan",
  async ({ planId, goalId, planData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `plan/plans/${goalId}/${planId}`,
        planData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data as ErrorResponse);
      } else {
        return rejectWithValue({ message: "予期しないエラーが発生しました。" });
      }
    }
  }
);

export const deletePlan = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>("plan/deletePlan", async (planId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`plan/plans/${planId}`);
    return planId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    resetSelectedPlan(state) {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(planList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(planList.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(planList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(getPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlanById.fulfilled, (state, action: PayloadAction<IPlan>) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action: PayloadAction<IPlan>) => {
        state.loading = false;
        console.log("Updated Plan:", action.payload);
        state.plans = state.plans.map((plan) =>
          plan._id === action.payload._id ? action.payload : plan
        );

        if (state.selectedPlan?._id === action.payload._id) {
          state.selectedPlan = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.plans = state.plans.filter((plan) => plan._id !== action.payload);
        if (state.selectedPlan?._id === action.payload) {
          state.selectedPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      });
  },
});

export const { resetSelectedPlan } = planSlice.actions;
export default planSlice.reducer;
