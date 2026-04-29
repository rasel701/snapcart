import { auth } from "@/auth";
import connectDB from "@/lib/db";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const assignment = await deliveryAssignmentModel.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { message: "Assigment not found" },
        { status: 400 },
      );
    }

    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "Assignment expired" },
        { status: 400 },
      );
    }
    const alreadyAssigned = await deliveryAssignmentModel.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "already assigned to other order" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await orderModel.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }
    order.assigndDeliveryBoy = deliveryBoyId;
    await order.save();

    await deliveryAssignmentModel.updateMany(
      {
        _id: { $ne: assignment._id },
        brodcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      { $pull: { brodcastedTo: deliveryBoyId } },
    );

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("accepted assignment error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
