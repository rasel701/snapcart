import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await orderModel.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();
    await sendMail(
      order.user.email,
      "Your Delivery OTP",
      `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`,
    );

    return NextResponse.json(
      { message: "Otp send successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("send otp error: ", error);
    return NextResponse.json({ message: "Send otp error" }, { status: 200 });
  }
}
