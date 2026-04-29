import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const orders = await orderModel
      .find({})
      .populate("user assigndDeliveryBoy")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("get admin orders :", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
