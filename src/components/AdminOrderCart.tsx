"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { UserI } from "@/models/user.model";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addNewOrder } from "@/redux/adminSlice";

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

const AdminOrderCart = ({ order }: { order: IOrder }) => {
  const socket = getSocket();
  const [isOpen, setIsOpen] = useState(false);
  const orderStatus = ["pending", "out of delivery"];
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);
  const dispatch = useDispatch<AppDispatch>();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "out of delivery": "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Invoice_${order._id}`,
  });
  console.log(currentStatus, +" ", order._id);
  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status },
      );
      console.log(result.data);
      setCurrentStatus(status);
      socket.emit("replace-status", { status, order });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-message-room", order._id);
    socket.on("assign-delivery-boy", ({ sendOrder }) => {
      console.log("sender item is admin :", sendOrder);

      dispatch(addNewOrder(sendOrder));
      // setOrders((prevOrders) =>
      //   prevOrders.map((item) =>
      //     item._id.toString() === sendOrder._id.toString() ? sendOrder : item,
      //   ),
      // );
    });

    return () => {
      socket.off("assign-delivery-boy");
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      ref={contentRef}
    >
      {/* Header Section */}
      <div className="p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg flex items-center">
            <Package className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">
              OrderId:
              <span className="text-green-700 font-bold">
                #{order?._id.toString().slice(7)}
              </span>
            </h3>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Calendar size={14} />
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[currentStatus]}`}
          >
            {currentStatus.toUpperCase()} x
          </span>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-600" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="px-5 py-3 bg-gray-50 border-y border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600 uppercase">
            {order.paymentMethod}
          </span>
          {order.isPaid ? (
            <CheckCircle2 size={14} className="text-green-500" />
          ) : (
            <Clock size={14} className="text-red-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600">
            ৳{order.deliveryFee} Fee
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-normal">Total:</span>
          <span className="text-sm font-bold text-green-700">
            ৳{order.totalAmount}
          </span>
        </div>
        <div>
          {order.assigndDeliveryBoy && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-2 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700 justify-center ">
                <UserCheck className="text-green-600 font-bold w-[40px] h-[40px]" />
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
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 grid md:grid-cols-2 gap-8 border-t border-gray-100">
              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  Items ({order.items.length})
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                    >
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x {item.price} / {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                  <MapPin size={16} /> Delivery Details
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-bold text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="flex items-start gap-2 text-gray-600">
                    <Home size={14} className="mt-1 flex-shrink-0" />
                    {order.address.fullAddress}, {order.address.city},{" "}
                    {order.address.state}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 font-medium">
                    <Phone size={14} /> {order.address.mobile}
                  </p>
                </div>

                {/* Action Buttons for Admin */}
                <div className="mt-6 flex gap-2">
                  <select
                    name=""
                    className="flex-1 bg-green-600 text-white  py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors px-3 outline-none"
                    onChange={(e) =>
                      updateStatus(order._id.toString(), e.target.value)
                    }
                    value={currentStatus}
                  >
                    {orderStatus.map((item, index) => (
                      <option value={item} className="text-lg px-6" key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-white transition-colors"
                    onClick={() => handlePrint()}
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminOrderCart;
