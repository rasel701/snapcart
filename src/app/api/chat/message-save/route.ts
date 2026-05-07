import connectDB from "@/lib/db";
import messageModel from "@/models/message.model";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { senderId, text, roomId, time } = await req.json();
    const room = await orderModel.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 400 });
    }
    const message = await messageModel.create({ senderId, text, roomId, time });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.log("save message error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
