"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/lib/socket";
import { addNewOrder } from "@/redux/adminSlice";
import { toast } from "react-toastify";
import { AppDispatch } from "@/redux/store";

const AdminMessage = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("admin-notification", (newOrder) => {
      console.log(newOrder, "order data");
      toast.success(`নতুন অর্ডার এসেছে! কাস্টমার: ${newOrder.customerName}`, {
        position: "top-right",
        autoClose: 5000,
      });

      dispatch(addNewOrder(newOrder.orderItem));
    });

    return () => {
      socket.off("admin-notification");
    };
  }, [socket, dispatch]);

  return <> {children}</>;
};

export default AdminMessage;
