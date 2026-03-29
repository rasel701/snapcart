import mongoose, { model, Schema, Document, models } from "mongoose";

interface IGrocery extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  caterory: string;
  price: string;
  unit: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const grocerySchema = new Schema<IGrocery>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    caterory: {
      type: String,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Packaged Food",
        "Baby & Pet Care",
      ],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const groceryModel =
  models.Grocery || model<IGrocery>("Grocery", grocerySchema);

export default groceryModel;
