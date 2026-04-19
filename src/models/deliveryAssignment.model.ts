import mongoos, { model, Schema, models, Document } from "mongoose";

interface IDeliveryAssignment extends Document {
  _id: mongoos.Types.ObjectId;
  order: mongoos.Types.ObjectId;
  brodcastedTo: mongoos.Types.ObjectId[];
  assigndTo: mongoos.Types.ObjectId | null;
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
