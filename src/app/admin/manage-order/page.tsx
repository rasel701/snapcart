"use client";
import AdminOrderCart from "@/components/AdminOrderCart";
import BackToHome from "@/components/BackToHome";
import { getSocket } from "@/lib/socket";

import { UserI } from "@/models/user.model";
import { addNewOrder, setAllOrders } from "@/redux/adminSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import mongoose from "mongoose";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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

const ManageOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.admin);
  console.log(orders);

  useEffect(() => {
    const getOrder = async () => {
      const result = await axios.get("/api/admin/get-orders");
      dispatch(setAllOrders(result.data));
      console.log(result.data);
    };
    getOrder();
  }, [dispatch]);

  return (
    <div>
      <BackToHome />
      <div className="mt-20 space-y-7 md:w-[90%] mx-auto">
        {orders.map((order) => (
          <AdminOrderCart key={order._id.toString()} order={order} />
        ))}
      </div>
    </div>
  );
};

export default ManageOrder;
