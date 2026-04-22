"use client";

import { IDeliveryAssignment } from "@/models/deliveryAssignment.model";
import axios from "axios";
import { useEffect, useState } from "react";
import AssignmentsCart from "./AssignmentsCart";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";

const DelivaryDashboard = () => {
  const [assignments, setAssignment] = useState<IDeliveryAssignment[]>([]);
  const socket = getSocket();
  const { userData } = useSelector((state: RootState) => state.user);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!userData?._id || !socket) return;
    const fetchAssignment = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignment");
        setAssignment(result.data);
        socket.emit("join-room", userData?._id);
        socket.on("new-assignment-received", (data) => {
          toast.success("Delivery order come");
          setAssignment((pre) => [data?.deliveryOrderData, ...pre]);
          setCount(count + 1);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssignment();
  }, [userData?._id, socket]);

  console.log(assignments);

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
