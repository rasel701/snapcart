"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import { addNewOrder } from "@/redux/adminSlice";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";

const AdminMessage = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;
    if (userData?.role != "admin") return;

    socket.on("admin-notification", (newOrder) => {
      console.log("Full Socket Data:", newOrder);
      toast.success(`নতুন অর্ডার এসেছে! কাস্টমার: ${newOrder.customerName}`, {
        position: "top-right",
        autoClose: 5000,
      });

      dispatch(addNewOrder(newOrder.orderItem));
    });

    return () => {
      socket.off("admin-notification");
    };
  }, [socket, dispatch, userData]);

  return <> {children}</>;
};

export default AdminMessage;
