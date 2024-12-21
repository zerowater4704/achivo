import mongoose, { Schema, Document } from "mongoose";

interface IPlan extends Document {
  title: string;
  description: string;
  status: string;
  startDate: Date;
  finishDate: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  goal_id: mongoose.Schema.Types.ObjectId;
  task_id: mongoose.Schema.Types.ObjectId[];
}

const planSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["未着手", "進行中", "完了"],
      default: "未着手",
    },
    startDate: { type: Date, required: true },
    finishDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    task_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>("Plan", planSchema);
