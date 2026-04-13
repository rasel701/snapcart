import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

type Role = "user" | "admin" | "delivery";
interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: Role;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser | null>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
