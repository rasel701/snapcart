"use client";
import { ArrowRight, CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 text-center bg-gradient-to-b from-green-50 to-white overflow-h">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="relative w-[80px] h-[80px] mx-auto"
      >
        <CheckCircle className="w-full h-full text-green-600 mx-auto mb-3" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-green-800 blur-sm" />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-2xl font-bold text-green-600"
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="text-gray-600 mt-3 text-sm md:text-base max-w-md"
      >
        Thank you for shopping with us! Your order has been placed and is being
        processed. You can track its progress in your
        <span className="font-semibold text-green-700"> My Orders </span>
        section
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, 20, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Package className="w-10 h-10 mt-7 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-12"
      >
        <Link href={"/user/my-order"}>
          <motion.div
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Go to My Orders <ArrowRight />{" "}
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
