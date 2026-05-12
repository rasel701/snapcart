"use client";

import { useEffect, useState } from "react";
import LiveMap from "./LiveMap";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { UserI } from "@/models/user.model";
import DeliveryBoyChat from "./DeliveryBoyChat";

interface IOrder {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pinCode: number;
    fullAddress: string;
    mobile: string;
    latitude: number;
    longitude: number;
  };
  isPaid: boolean;
  assignment?: mongoose.Types.ObjectId;
  assigndDeliveryBoy?: UserI;
  status: "pending" | "out of delivery" | "delivered";
  deliveryFee: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface propes {
  deliveryBoyLoc: number[];
  userLoc: number[];
  order: IOrder;
  userId: string | undefined;
  role: string | undefined;
}

interface ILocation {
  latitude: number;
  longitude: number;
}
const UserTrackOrder = ({
  deliveryBoyLoc,
  userLoc,
  order,
  userId,
  role,
}: propes) => {
  const router = useRouter();

  const [userLocation, setUserLoacation] = useState<ILocation>({
    latitude: userLoc[1],
    longitude: userLoc[0],
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: deliveryBoyLoc[1],
    longitude: deliveryBoyLoc[0],
  });
  console.log("User", userLoc);
  console.log("delivery:", deliveryBoyLoc);

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      console.log("delivery location:", location);
      if (userId.toString() === order?.assigndDeliveryBoy?._id.toString()) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });
      }
    });
    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, [order]);

  return (
    <div className="p-4 min-h-screen bg-gray-50 pt-[120px]">
      <button className="bg-green-600 px-6 rounded-lg text-white font-semibold py-1 flex items-center cursor-pointer">
        <ArrowLeft />
        <span className="mb-1"> Back</span>
      </button>
      <div className="max-w-2xl mx-auto ">
        <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Active Delivery
        </h2>

        <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
          <LiveMap
            userLocation={userLocation}
            deliveryBoyLocation={deliveryBoyLocation}
          />
        </div>
        <DeliveryBoyChat orderId={order._id} senderId={userId} role={role} />
      </div>
    </div>
  );
};

export default UserTrackOrder;
