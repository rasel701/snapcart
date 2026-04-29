"use client";

import axios from "axios";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import UserOrderCart from "@/components/UserOrderCart";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import mongoose from "mongoose";
import { UserI } from "@/models/user.model";

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

const MyOrder = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getMyOrder = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        console.log(result.data);
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrder();
  }, []);
  const router = useRouter();
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !userData?._id) return;

    socket.emit("join-room", userData._id);

    socket.on("new-order-notification", ({ order }) => {
      console.log("Received update:", order);
      setOrders((prevOrders) => {
        const remainingOrders = prevOrders.filter(
          (item) => item._id !== order?._id,
        );
        return [order, ...remainingOrders];
      });
    });

    return () => {
      socket.off("new-order-notification");
    };
  }, [socket, userData?._id]);

  return (
    <div className="bg-linear-tob from-white to-gray-600 min-h-[200vh] ">
      <h2 className="flex  items-center border-b mb-5 py-5 fixed w-full top-0  px-15 bg-gray-100 shadow-2xl border-gray-400">
        <div
          className="bg-green-100 p-2 mr-3 rounded-full cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={30} />
        </div>
        <span className="text-2xl font-bold mb-1 text-gray-600">
          {" "}
          My Orders
        </span>
      </h2>
      <div className="">
        {orders?.length == 0 ? (
          <div className="pt-20 flex flex-col items-center text-center justify-center mt-40">
            <PackageSearch size={70} className="text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start shopping to view your orders here.
            </p>
          </div>
        ) : (
          <div className="mt-34 space-y-6 w-full md:w-[70%] mx-auto">
            {orders?.map((order) => (
              <motion.div
                key={order._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <UserOrderCart order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
