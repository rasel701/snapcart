"use client";
import { LogOut, Package, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UserIn {
  name: string;
  image?: string;
  role: "user" | "delivery" | "admin";
}

interface DropDownProps {
  user: UserIn;
  setFun: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown = ({ user, setFun }: DropDownProps) => {
  const handleLogOut = () => {
    setFun(false);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        exit={{ opacity: 0, y: -10, scale: 0 }}
        className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-999"
      >
        <div className="flex items-center  gap-2 ">
          {user.image ? (
            <Image
              src={user.image}
              alt="user"
              width={50}
              height={50}
              className="rounded-full cursor-pointer hover:scale-105  transition-all"
            />
          ) : (
            <User />
          )}
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-600">
              {user?.name}
            </span>
            <span className="mt-[-9] text-gray-500">{user?.role}</span>
          </div>
        </div>
        <Link
          href={"/user/my-order"}
          className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-500 mt-3"
          onClick={() => setFun(false)}
        >
          <Package className="w-7 h-7 text-green-600" /> My Orders
        </Link>
        <button
          className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium cursor-pointer"
          onClick={handleLogOut}
        >
          <LogOut className="text-red-500" />
          Log Out
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default DropDown;
