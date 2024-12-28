import mongoose, { Schema, Document } from "mongoose";

interface IPlan extends Document {
  title: string;
  description: string;
  isCompleted: boolean;
  progress: number;
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
    isCompleted: { type: Boolean, default: false },
    progress: { type: Number, default: 0, min: 0, max: 100 },
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
