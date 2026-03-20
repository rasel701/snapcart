"use client";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

type ProtoType = {
  nextStep: (s: number) => void;
};

const Welcome = ({ nextStep }: ProtoType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 flex justify-center items-center gap-3">
          <ShoppingBasket size={40} />
          Snapcart
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop dustionation for fresh groceries. organic produce, and
        daily essentials delivered right to your doorstep
      </motion.p>

      <div className="flex justify-center items-center gap-8">
        <motion.div
          initial={{ x: -40, opacity: 0, scale: 0 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <ShoppingBasket className="text-green-700" size={70} />
        </motion.div>
        <motion.div
          initial={{ x: 40, opacity: 0, scale: 0 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Bike size={70} className="text-orange-700" />
        </motion.div>
      </div>
      <motion.button
        onClick={() => nextStep(2)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-green-700 px-13 py-3 mt-3 rounded-lg text-lg text-white flex justify-center items-center gap-2 cursor-p cursor-pointer"
      >
        Next
        <ArrowRight />
      </motion.button>
    </div>
  );
};

export default Welcome;
