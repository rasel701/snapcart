import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, socketId } = await req.json();

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true },
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const u = await userModel.findById(userId);

    return NextResponse.json(u, { status: 200 });
  } catch (error) {
    console.log("identify user", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
