import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  password: string;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    googleId: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
