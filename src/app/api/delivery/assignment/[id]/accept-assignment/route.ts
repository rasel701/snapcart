import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { getSocket } from "@/lib/socket";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const { id } = await params;
    const authSession = await auth();
    const deliveryBoyId = authSession?.user?.id;
    console.log("Delivery Boy ID being assigned:", deliveryBoyId);
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const alreadyAssignment = await deliveryAssignmentModel.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    });

    if (alreadyAssignment) {
      return NextResponse.json(
        { message: "You already have an active delivery" },
        { status: 400 },
      );
    }

    const assignment = await deliveryAssignmentModel.findOneAndUpdate(
      { _id: id, status: "brodcasted" },
      {
        $set: {
          assignedTo: deliveryBoyId,
          status: "assigned",
          acceptedAt: new Date(),
        },
      },
      { new: true, session },
    );
    console.log(assignment, "Assignment is delivery");

    if (!assignment) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "Assignment no longer available or already taken" },
        { status: 400 },
      );
    }

    const order = await orderModel.findByIdAndUpdate(
      assignment.order,
      { assigndDeliveryBoy: deliveryBoyId },
      { session },
    );

    if (!order) {
      throw new Error("Order not found");
    }
    const sendOrder = await orderModel
      .findById(assignment.order)
      .session(session)
      .populate("user  assigndDeliveryBoy");
    console.log("send order is sendOrder: ", sendOrder);
    const socket = getSocket();
    socket.emit("delivery-assign-send", { sendOrder });

    await deliveryAssignmentModel.updateMany(
      {
        _id: { $ne: assignment._id },
        brodcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      { $pull: { brodcastedTo: deliveryBoyId } },
      { session },
    );

    await session.commitTransaction();

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    await session.abortTransaction();
    console.log("accepted assignment error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
