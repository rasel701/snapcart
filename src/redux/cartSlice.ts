import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 40,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((value) => value._id === action.payload);
      if (item) {
        item.quantity = item.quantity + 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((value) => value._id === action.payload);

      if (item?.quantity && item?.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        state.cartData = state.cartData.filter(
          (value) => value._id !== action.payload,
        );
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload,
      );
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      state.subTotal = state.cartData.reduce((sum, item) => {
        sum += Number(item.price) * item.quantity;
        return sum;
      }, 0);
      state.deliveryFee = state.subTotal > 1000 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee;
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeItem } =
  cartSlice.actions;

export default cartSlice.reducer;
