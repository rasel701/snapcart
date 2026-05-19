import connectDB from "@/lib/db";
import { getSocket } from "@/lib/socket";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId, otp } = await req.json();
    console.log(orderId, " and ", otp);
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "OrderId or Otp not found" },
        { status: 400 },
      );
    }

    const order = await orderModel
      .findById(orderId)
      .populate("user  assigndDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ message: "Incorrect Otp" }, { status: 400 });
    }

    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    order.isPaid = true;
    await order.save();
    const socket = getSocket();
    // socket.emit("join-room", order?.user._id);
    socket.emit("send-user-notification", order);
    await deliveryAssignmentModel.updateOne(
      { order: orderId },
      {
        $set: {
          assignedTo: null,
          status: "completed",
        },
      },
    );

    return NextResponse.json(
      { message: "Delivery Successfully completed" },
      { status: 200 },
    );
  } catch (error) {
    console.log("verify otp :", error);
    return NextResponse.json(
      { message: "Intarnal server error:" },
      { status: 500 },
    );
  }
}
