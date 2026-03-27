"use client";
import { Leaf, ShoppingBag, Smartphone, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const HeroSection = () => {
  const services = [
    {
      id: 1,
      icon: (
        <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />
      ),
      title: "Fresh Organic Groceries 🥬",
      subtitle:
        "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      icon: (
        <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
      ),
      title: "Fast & Reliable Delivery 🚚",
      subtitle: "We ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
      bg: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />
      ),
      title: "Shop Anytime, Anywhere 📱",
      subtitle: "Easy and seamless online grocery shopping experience.",
      btnText: "Get Started",
      bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl z-30">
      <AnimatePresence>
        <motion.div
          key={services[current].id}
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          exit={{ opacity: 0, x: -200 }}
          className="absolute inset-0"
        >
          <Image
            src={services[current]?.bg}
            fill
            alt="service"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 max-w-3xl"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">
            {services[current].icon}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {services[current].title}
          </h2>
          <p className="text-sm md:text-lg">{services[current].subtitle}</p>
          <motion.button
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.6 }}
            className="mt-4 bg-white text-gray-700 hover:bg-green-200 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {services[current].btnText}
          </motion.button>

          <div className="flex gap-2 ">
            {services.map((_, index) => {
              return (
                <button
                  key={index}
                  className={`h-3 w-3 transition-all mt-6 bg-gray-400 rounded-full ${current === index && "bg-white w-5 "}`}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
