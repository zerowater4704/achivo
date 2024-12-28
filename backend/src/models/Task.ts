import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  isCompleted: boolean;
  startDate: Date;
  finishDate: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  plan_id: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
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
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
