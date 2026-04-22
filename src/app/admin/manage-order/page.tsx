"use client";
import AdminOrderCart from "@/components/AdminOrderCart";
import BackToHome from "@/components/BackToHome";
import { getSocket } from "@/lib/socket";
import { IOrder } from "@/models/order.model";
import { addNewOrder, setAllOrders } from "@/redux/adminSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ManageOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.admin);
  console.log(orders);
  const socket = getSocket();

  useEffect(() => {
    const getOrder = async () => {
      const result = await axios.get("/api/admin/get-orders");
      dispatch(setAllOrders(result.data));
    };
    getOrder();
  }, [dispatch]);

  console.log(orders);

  return (
    <div>
      <BackToHome />
      <div className="mt-20 space-y-7 md:w-[90%] mx-auto">
        {orders.map((order: IOrder, index: number) => (
          <AdminOrderCart key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default ManageOrder;
