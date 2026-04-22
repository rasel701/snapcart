import connectDB from "@/lib/db";
import { getSocket } from "@/lib/socket";
import deliveryAssignmentModel from "@/models/deliveryAssignment.model";
import orderModel, { IOrder } from "@/models/order.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
const socket = getSocket();

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await req.json();
    const order: IOrder = await orderModel.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }

    order.status = status;
    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await userModel.find({
        role: "delivery",
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: 10000,
          },
        },
      });
      const neayByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await deliveryAssignmentModel
        .find({
          assignedTo: { $in: neayByIds },
          status: { $nin: ["brodcasted", "completed"] },
        })
        .distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );
      const candidates = availableDeliveryBoys.map((b) => b._id);
      if (candidates.length == 0) {
        await order.save();
        return NextResponse.json(
          { message: "Delivery not available" },
          { status: 200 },
        );
      }
      const deliveryAssignment = await deliveryAssignmentModel.create({
        order: order._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });
      if (socket) {
        const deliveryOrderData = await deliveryAssignmentModel
          .findOne({ order: order._id })
          .populate("order");
        console.log(deliveryAssignment);
        // send-delivery-notification
        console.log("Send-delivery-notification");
        socket.emit("send-delivery-notification", {
          deliveryBoyIds: candidates,
          data: {
            type: "NEW_ORDER",
            assignmentId: deliveryAssignment._id,
            deliveryOrderData,
            orderId: order._id,
            totalAmount: order.totalAmount,
            address: order.address.city,
          },
        });
      }

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        _id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
    }
    await order.save();
    await order.populate("user");

    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("update status error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
