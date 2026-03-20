import mongoose, { Schema, model, models, Document } from "mongoose";

type Role = "user" | "admin" | "delivery";

interface UserI extends Document {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserI>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    mobile: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },
  },
  { timestamps: true },
);

const userModel = models.User || model<UserI>("User", userSchema);

export default userModel;
