import mongoose, { model, Schema, models, Document } from "mongoose";

import "@/models/order.model";
import "@/models/user.model";

export interface IDeliveryAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  brodcastedTo: mongoose.Types.ObjectId[];
  assigndTo: mongoose.Types.ObjectId | null;
  status: "brodcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    brodcastedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assigndTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptedAt: {
      type: Date,
    },
  },

  { timestamps: true },
);

const deliveryAssignmentModel =
  models.DeliveryAssignment ||
  model<IDeliveryAssignment>("DeliveryAssignment", deliveryAssignmentSchema);

export default deliveryAssignmentModel;
