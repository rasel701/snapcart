import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        {
          message: "please send all creentials",
        },
        { status: 400 },
      );
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const newOrder = await orderModel.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.log("place order error ", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
