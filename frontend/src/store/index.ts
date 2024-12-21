import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import goalReducer from "./features/goal/goalSlice";
import planReducer from "./features/plan/planSlice";
import taskReducer from "./features/task/taskSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    goal: goalReducer,
    plan: planReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
