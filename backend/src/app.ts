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
import setupPassport from "./config/passport";

const app = express();
const PORT = 3000;
dotenv.config();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

setupPassport(passport);

// app.use("/auth/", authRouter);

app.use("/api/user", userRouter);
app.use("/api/goal", goalRouter);
app.use("/api/plan", planRouter);
app.use("/api/task", taskRouter);

app.listen(PORT, () => {
  console.log("server is running");
});
