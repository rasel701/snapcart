"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const GeoUpdater = ({ userId }: { userId: string }) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const socket = getSocket();
  useEffect(() => {
    if (userData) {
      socket.emit("identity", userData?._id);
    }
  }, [userData]);

  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        socket.emit("update-location", {
          userId,
          latitude: lat,
          longitude: lon,
        });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);

  return null;
};

export default GeoUpdater;
