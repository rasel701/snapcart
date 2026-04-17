import AdminOrderCart from "@/components/AdminOrderCart";
import BackToHome from "@/components/BackToHome";
import connectDB from "@/lib/db";
import orderModel, { IOrder } from "@/models/order.model";
import React from "react";

const ManageOrder = async () => {
  await connectDB();
  const result: IOrder[] = await orderModel
    .find({})
    .populate("user")
    .sort({ createdAt: -1 })
    .lean();

  const orders = JSON.parse(JSON.stringify(result));

  return (
    <div>
      <BackToHome />
      <div className="mt-20 space-y-7">
        {orders.map((order, index) => (
          <AdminOrderCart key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default ManageOrder;
