import mongoose, { Schema, Document } from "mongoose";

interface IGoal extends Document {
  title: string;
  description: string;
  isCompleted: boolean;
  progress: number;
  startDate: Date;
  finishDate: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  plan_id: mongoose.Schema.Types.ObjectId[];
}

const goalSchema: Schema = new Schema(
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
    plan_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>("Goal", goalSchema);
