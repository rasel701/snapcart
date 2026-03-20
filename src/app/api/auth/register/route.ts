import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        { message: "email already esist!" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hash });

    const { password: _, ...userWithOutPassword } = user.toObject();

    return NextResponse.json(
      { message: "User registered successfully", user: userWithOutPassword },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `register error ${error}` },
      { status: 500 },
    );
  }
}
