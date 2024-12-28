import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../hooks/useAxios";

interface UserInfo {
  email: string;
  name: string;
}

interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

interface ErrorResponse {
  message: string;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
  accessToken: localStorage.getItem("token") || null,
};

export const signupUser = createAsyncThunk<
  { accessToken: string; user: UserInfo },
  { email: string; password: string; name: string },
  { rejectValue: ErrorResponse }
>("user/signupUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`user/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const loginUser = createAsyncThunk<
  { userInfo: { email: string; name: string }; accessToken: string },
  { email: string; password: string },
  { rejectValue: ErrorResponse }
>("user/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`user/login`, userData, {
      withCredentials: true,
    });
    const { user, accessToken } = response.data;
    return { userInfo: { email: user.email, name: user.name }, accessToken };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data as ErrorResponse);
    } else {
      return rejectWithValue({ message: "予期しないエラーが発生しました。" });
    }
  }
});

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`user/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      return rejectWithValue("ログアウトに失敗しました。");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.userInfo = null;
    //   state.accessToken = null;
    //   localStorage.removeItem("token");
    // },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    },
    resetError(state) {
      state.error = null; // エラーをリセット
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.userInfo;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorResponse).message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateToken, resetError } = userSlice.actions;
export default userSlice.reducer;
