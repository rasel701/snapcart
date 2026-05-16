import { UserI } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IOrder {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pinCode: number;
    fullAddress: string;
    mobile: string;
    latitude: number;
    longitude: number;
  };
  isPaid: boolean;
  assignment?: mongoose.Types.ObjectId;
  assigndDeliveryBoy?: UserI;
  status: "pending" | "out of delivery" | "delivered";
  deliveryFee: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAdmin {
  orders: IOrder[];
}

const initialState: IAdmin = {
  orders: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAllOrders: (state, active: PayloadAction<IOrder[]>) => {
      state.orders = active.payload;
    },
    addNewOrder: (state, action: PayloadAction<IOrder>) => {
      const filterData = state.orders.filter(
        (item) => item._id.toString() !== action.payload._id.toString(),
      );
      state.orders = [action.payload, ...filterData];
    },
  },
});

export const { setAllOrders, addNewOrder } = adminSlice.actions;

export default adminSlice.reducer;
