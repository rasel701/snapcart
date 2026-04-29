import { auth } from "@/auth";
import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const orders = await orderModel
      .find({ user: session?.user?.id })
      .populate("user assigndDeliveryBoy")
      .sort({ createdAt: -1 });
    if (!orders) {
      return NextResponse.json(
        { message: "Orders not found" },
        { status: 400 },
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("fetch my order data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
