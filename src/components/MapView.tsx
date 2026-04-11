"use client";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { motion } from "motion/react";
import { LocateFixed } from "lucide-react";
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/2642/2642502.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface addressI {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

const MapView = ({
  position,
  setPosition = () => {},
  address,
  handleGoToMainPosition,
  mainLocationLoading,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  address: addressI;
  handleGoToMainPosition: () => void;
  mainLocationLoading: boolean;
}) => {
  if (!position) return null;

  const DraggableMarker: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [position, map]);

    return (
      <Marker
        icon={markerIcon}
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      >
        <Popup>{address.fullAddress}</Popup>
      </Marker>
    );
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={position as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker />
      </MapContainer>
      <motion.button
        disabled={mainLocationLoading}
        whileTap={{ scale: 0.8 }}
        className={`absolute bottom-6 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999 cursor-pointer ${mainLocationLoading ? "bg-red-600" : ""}`}
        onClick={() => {
          handleGoToMainPosition();
          console.log(mainLocationLoading);
        }}
      >
        <LocateFixed size={22} />
      </motion.button>
    </div>
  );
};

export default MapView;
