import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    text: {
      type: String,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    time: {
      type: String,
    },
  },
  { timestamps: true },
);

const messageModel =
  models.MessageModel || model<IMessage>("MessageModel", messageSchema);

export default messageModel;
