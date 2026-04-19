"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "@/lib/socket";
import { addNewOrder } from "@/redux/adminSlice";
import { toast } from "react-toastify";
import { AppDispatch } from "@/redux/store";

const AdminMessage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("admin-notification", (newOrder) => {
      // এটি এখন যেকোনো পেজ থেকেই কাজ করবে
      toast.success(`নতুন অর্ডার এসেছে! কাস্টমার: ${newOrder.customerName}`, {
        position: "top-right",
        autoClose: 5000,
      });

      // Redux-এ ডাটা পুশ করে রাখা যাতে পরে ManageOrder পেজে গেলে সেটি দেখা যায়
      dispatch(addNewOrder(newOrder.orderItem));
    });

    return () => {
      socket.off("admin-notification");
    };
  }, [socket, dispatch]);

  return null;
};

export default AdminMessage;
