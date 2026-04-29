"use cleint";
import { IOrder } from "@/models/order.model";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
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

const UserOrderCart = ({ order }: { order: IOrder }) => {
  const [status, setStatus] = useState(order?.status);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yello-100 text-yellow-700 border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-blue-300";

      default:
        break;
    }
  };
  const [expended, setExpended] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order:
            <span className="text-green-700 font-bold">
              #{order?._id.toString().slice(7)}
            </span>
          </h3>
          <p className="text-sm text-green-500 mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"} `}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(order.status)}`}
          >
            {order?.status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          {order.paymentMethod === "cod" ? (
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Truck size={16} className="text-green-600" />
              <span className="mb-1">Cash On Delivery</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <CreditCard size={16} className="text-green-600" />
              <span className="mb-1">Online Payment</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-green-600" />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>
        <div>
          {order.assigndDeliveryBoy && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-2 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700 justify-center ">
                <UserCheck className="text-green-600 font-bold w-[30px] h-[30px]" />
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <span className="text-lg font-bold text-gray-600">
                    Assigned to: {order.assigndDeliveryBoy?.name}
                  </span>
                  <p>📞: {order?.assigndDeliveryBoy?.mobile}</p>
                  <a
                    href={`tel:${order.assigndDeliveryBoy?.mobile}`}
                    className="bg-green-400 p-2 rounded-full text-gray-800 font-semibold hover:bg-green-500 transition-all"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <button
            className="w-full justify-between flex items-center font-medium text-gray-700 hover:text-green-700 transition gap-1  cursor-pointer"
            onClick={() => setExpended((prev) => !prev)}
          >
            <span className=" flex  items-center justify-center gap-1 hover:bg-gray-100 px-3 py-2 rounded-lg">
              <Package size={20} className="text-green-700 mt-1" />
              {expended
                ? "Hide Order Items"
                : `view ${order.items.length} item`}
            </span>
            <span>
              {expended ? (
                <ChevronUp size={20} className="text-green-700" />
              ) : (
                <ChevronDown size={20} className="text-green-700" />
              )}
            </span>
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expended ? "auto" : 0,
              opacity: expended ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden   "
          >
            <div className="mt-3 space-y-3 ">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between px-3 items-center gap-4 bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition-all "
                >
                  <div className="flex justify-center items-center gap-3">
                    <Image
                      src={item.image}
                      width={100}
                      height={100}
                      alt="produc"
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-gray-800 font-bold">{item.name}</h2>
                      <p className="text-gray-500 text-sm">
                        {item.quantity} x {item.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-600 font-semibold *:">
                    {" "}
                    <span className="text-2xl">৳</span>
                    {Number(item.price) * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 items-center px-3">
              <span className="text-gray-600">Delivery-Fee</span>
              <span className="text-gray-600 font-bold">
                <span className="text-2xl">৳</span>
                {order.deliveryFee || 0}
              </span>
            </div>
            <div className="border-2 mt-6  border-gray-400 rounded-full mx-auto" />
            <div className="flex justify-between items-center mt-2">
              <div className="flex justify-center items-center gap-1">
                <Truck size={20} className="text-green-600 mt-1" />
                <span className="text-gray-500">Delivery:</span>
                <span className="text-green-600">{order.status}</span>
              </div>
              <div className="px-2 font-bold text-gray-600">
                total:
                <span className="text-green-600">
                  {" "}
                  <span className="text-2xl font-bold">৳</span>
                  {order.totalAmount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderCart;
