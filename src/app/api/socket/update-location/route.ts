import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, location } = await req.json();
    if (!userId || !location) {
      return NextResponse.json(
        { message: "missing user id and location" },
        { status: 400 },
      );
    }
    const user = await userModel.findByIdAndUpdate(
      userId,
      { location },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    return NextResponse.json({ message: "Location updated" }, { status: 200 });
  } catch (error) {
    console.log("update location error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
