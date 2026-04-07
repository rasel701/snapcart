"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import mongoose from "mongoose";

interface GroceryI {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
}

const GroceryItemCard = ({ grocery }: { grocery: GroceryI }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((item) => item._id === grocery._id);
  console.log(cartItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group h-full"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden p-4 ">
        <Image
          src={grocery.image || "/placeholder.png"}
          alt={grocery.name}
          fill
          className="object-contain rounded-lg p-2 group-hover:scale-110 transition-transform duration-500 "
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          {grocery.category}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-gray-800 font-bold text-lg leading-tight mb-1 truncate">
          {grocery.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Unit:{" "}
          <span className="text-gray-600 font-medium">{grocery.unit}</span>
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-green-600">
              ৳{grocery.price}
            </span>
          </div>

          {/* Add Button */}
          {cartItem ? (
            <div className="">
              <button
                className="bg-green-500 px-6 py-2 rounded-lg text-white cursor-pointer"
                onClick={() => dispatch(increaseQuantity(grocery._id))}
              >
                {" "}
                <Plus className=" "></Plus>
              </button>
              <span className="text-2xl px-2">{cartItem.quantity}</span>
              <button
                className="bg-green-500 px-6 py-2 rounded-lg text-white cursor-pointer"
                onClick={() => dispatch(decreaseQuantity(grocery._id))}
              >
                <Minus />
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl shadow-lg shadow-green-200 transition-colors flex items-center justify-center cursor-pointer"
              onClick={() => dispatch(addToCart({ ...grocery, quantity: 1 }))}
            >
              Add to card
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
