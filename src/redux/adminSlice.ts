import { IOrder } from "@/models/order.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      state.orders = [action.payload, ...state.orders];
    },
  },
});

export const { setAllOrders, addNewOrder } = adminSlice.actions;

export default adminSlice.reducer;
