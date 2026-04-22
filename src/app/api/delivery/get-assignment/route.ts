import { auth } from "@/auth";
import connectDB from "@/lib/db";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    const assignment = await deliveryAssignmentModel
      .find({
        brodcastedTo: session?.user?.id,
        status: "brodcasted",
      })
      .populate("order");
    return NextResponse.json(assignment, { status: 200 });
  } catch (error) {
    console.log("get deliver boy ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
