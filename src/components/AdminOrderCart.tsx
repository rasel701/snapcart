"use client";
import React, { useState } from "react";
import { IOrder } from "@/models/order.model";
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
} from "lucide-react";
import Image from "next/image";

const AdminOrderCart = ({ order }: { order: IOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  // স্ট্যাটাস অনুযায়ী কালার নির্ধারণ
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "out of delivery": "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header Section */}
      <div className="p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <Package className="text-green-600" size={24} />
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

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}
          >
            {order.status.toUpperCase()}
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
                  <button className="flex-1 bg-green-600 text-white text-xs py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Update Status
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-white transition-colors">
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
