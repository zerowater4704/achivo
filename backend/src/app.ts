import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./db";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user";
import goalRouter from "./routes/goal";
import planRouter from "./routes/plan";
import taskRouter from "./routes/task";
import authRouter from "./routes/authRoutes";
import passport from "passport";

const app = express();
const PORT = process.env.PORT;
dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRouter);

app.use("/api/user", userRouter);
app.use("/api/goal", goalRouter);
app.use("/api/plan", planRouter);
app.use("/api/task", taskRouter);

app.listen(PORT, () => {
  console.log("server is running");
});
