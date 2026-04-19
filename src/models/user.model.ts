import mongoose, { Schema, model, models, Document } from "mongoose";

type Role = "user" | "admin" | "delivery";

interface UserI extends Document {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: Role;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  location?: {
    type: {
      type: StringConstructor;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: NumberConstructor[];
      default: number[];
    };
  };
  socketId: string | null;
  isOnline: boolean;
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
      required: false,
    },
    mobile: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },
    image: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const userModel = models.User || model<UserI>("User", userSchema);

export default userModel;

//
