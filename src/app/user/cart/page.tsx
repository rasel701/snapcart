"use client";
import { AppDispatch, RootState } from "@/redux/store";
import { ArrowLeft, ShoppingBasket, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"; // motion/react থেকে অনেক সময় framer-motion ভালো কাজ করে
import Image from "next/image";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/redux/cartSlice";

const CardPage = () => {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();

  const totalPrice = cartData.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="w-[95%] max-w-7xl mx-auto mt-12 mb-24 min-h-[70vh]">
      {/* Back Button */}
      <Link
        href={"/"}
        className="inline-flex items-center gap-2 text-green-700 hover:text-white font-semibold transition-all bg-green-100 hover:bg-green-600 px-4 py-2 rounded-full mb-8 shadow-sm group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Shopping</span>
      </Link>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10"
      >
        🛒 My <span className="text-green-600">Shopping Cart</span>
      </motion.h2>

      {cartData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBasket className="w-20 h-20 text-green-300 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            Your cart is empty!
          </h3>
          <p className="text-gray-400 mb-8 max-w-xs mx-auto">
            Looks like you have not added anything to your cart yet.
          </p>
          <Link
            href={"/"}
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartData.map((item, index) => (
                <motion.div
                  key={item._id?.toString() || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-5 w-full">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{item.unit}</p>
                      <p className="text-green-600 font-bold text-lg">
                        ৳{Number(item.price) * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-gray-50 px-3 py-2 rounded-lg">
                    <button
                      className="p-1 hover:text-red-500 transition-colors"
                      onClick={() => dispatch(decreaseQuantity(item?._id))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-gray-700 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="p-1 hover:text-green-500 transition-colors"
                      onClick={() => dispatch(increaseQuantity(item._id))}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => dispatch(removeItem(item._id))}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-10"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">৳{subTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-medium">
                  ৳{deliveryFee}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>৳{finalTotal}</span>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white mt-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-[0.98]">
              Proceed to Checkout
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Secure checkout powered by Stripe
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CardPage;
