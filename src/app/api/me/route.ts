import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "User is not authenticated",
        },
        { status: 401 },
      );
    }

    const user = await userModel
      .findOne({ email: session?.user.email })
      .select("-password");
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log("Get me error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
