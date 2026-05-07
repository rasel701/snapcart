import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ orderId: string }>;
  },
) {
  try {
    await connectDB();
    const responseParams = await params;
    console.log(responseParams.orderId, "Order id is");
    if (!responseParams.orderId) {
      return NextResponse.json(
        { message: "OrderId not found" },
        { status: 400 },
      );
    }

    const order = await orderModel
      .findById(responseParams.orderId)
      .populate("assigndDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log("get-order tracking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
