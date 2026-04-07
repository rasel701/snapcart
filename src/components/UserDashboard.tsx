import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import connectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";
import GroceryItemCard from "./GroceryItemCard";
import mongoose from "mongoose";

interface GroceryI {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDashboard = async () => {
  await connectDB();
  const groceries = await groceryModel.find({}).lean();
  const allGroceries = JSON.parse(JSON.stringify(groceries));

  return (
    <div>
      <HeroSection />
      <CategorySlider />
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
          Popular Grocery Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[90%] mx-auto  ">
          {allGroceries.map((grocery: GroceryI, index: number) => (
            <GroceryItemCard grocery={grocery} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
