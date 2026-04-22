import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await userModel.findOne({ role: "admin" });
    if (user) {
      return NextResponse.json({ adminExist: true }, { status: 200 });
    } else {
      return NextResponse.json({ adminExist: false }, { status: 200 });
    }
  } catch (error) {
    console.log("get admin data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
