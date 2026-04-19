"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackToHome = () => {
  const router = useRouter();
  return (
    <div className="flex  items-center border-b mb-5 py-5 fixed w-full top-0  px-15 bg-gray-100 shadow-2xl border-gray-400 z-999">
      <div
        className="bg-green-100 p-2 mr-3 rounded-full cursor-pointer"
        onClick={() => router.push("/")}
      >
        <ArrowLeft size={30} />
      </div>
      <span className="text-2xl font-bold mb-1 text-gray-600">
        {" "}
        Manage Orders
      </span>
    </div>
  );
};

export default BackToHome;
