import messageModel from "@/models/message.model";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomId } = await req.json();

    const room = await orderModel.findById(roomId);

    console.log("room order :", room);

    if (!room) {
      return NextResponse.json(
        { message: "room is not found" },
        { status: 400 },
      );
    }

    const message = await messageModel.find({ roomId });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.log("get room data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
