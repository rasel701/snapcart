"use client";

import { IDeliveryAssignment } from "@/models/deliveryAssignment.model";
import axios from "axios";
import { useEffect, useState } from "react";
import AssignmentsCart from "./AssignmentsCart";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import LiveMap from "./LiveMap";
import DeliveryBoyChat from "./DeliveryBoyChat";

interface ILocation {
  latitude: number;
  longitude: number;
}

const DelivaryDashboard = () => {
  const [assignments, setAssignment] = useState<IDeliveryAssignment[]>([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userLocation, setUserLoacation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const socket = getSocket();
  const { userData } = useSelector((state: RootState) => state.user);
  const [count, setCount] = useState(0);

  const fetchInitialData = async () => {
    if (!userData?._id) return;
    try {
      const [assignmentRes, currentOrderRes] = await Promise.all([
        axios.get("/api/delivery/get-assignment"),
        axios.get("/api/delivery/current-order"),
      ]);
      setAssignment(assignmentRes.data);
      console.log("current order:", currentOrderRes.data);
      if (currentOrderRes?.data?.active) {
        setCurrentOrder(currentOrderRes.data.assignment);
        setUserLoacation({
          latitude: currentOrderRes.data.assignment.order.address.latitude,
          longitude: currentOrderRes.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [userData?._id]);

  useEffect(() => {
    if (!socket || !userData?._id) return;
    socket.emit("join-room", userData._id);
    const handleNewAssignment = (data: any) => {
      toast.success("নতুন ডেলিভারি অর্ডার এসেছে!");
      setAssignment((prev) => [data?.deliveryOrderData, ...prev]);
      setCount((prevCount) => prevCount + 1);
    };
    socket.on("new-assignment-received", handleNewAssignment);

    return () => {
      socket.off("new-assignment-received", handleNewAssignment);
    };
  }, [socket, userData?._id]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({ latitude: lat, longitude: lon });
        socket.emit("update-location", {
          userId: userData._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id, socket]);

  console.log("deliveryboylocation", deliveryBoyLocation);

  if (currentOrder) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 pt-[120px]">
        <div className="max-w-2xl mx-auto ">
          <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">
            Active Delivery
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Order#{currentOrder?.order?._id.slice(10)}
          </p>
          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
          <DeliveryBoyChat
            orderId={currentOrder?.order?._id}
            senderId={userData?._id || undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-[80%] mx-auto mt-28">
        <span>Item:{count}</span>
        <h2 className="text-2xl font-bold mb-4">Delivery Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {assignments.map((assignment, index) => (
            <AssignmentsCart key={index} assignment={assignment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DelivaryDashboard;
