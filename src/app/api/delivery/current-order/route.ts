import { auth } from "@/auth";
import connectDB from "@/lib/db";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
console.log("Delivery Boy ID being assigned:", deliveryBoyId);
    const activeAssignment = await deliveryAssignmentModel
      .findOne({
        assignedTo: deliveryBoyId,
        status: "assigned",
      })
      .populate({
        path: "order",
        populate: { path: "address" },
      })
      .lean();
    console.log(activeAssignment);
    if (!activeAssignment) {
      return NextResponse.json({ active: false }, { status: 200 });
    }
    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 },
    );
  } catch (error) {
    console.log("current-order access", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 200 },
    );
  }
}
