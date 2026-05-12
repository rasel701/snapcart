import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

interface ILocation {
  latitude: number;
  longitude: number;
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

const LiveMap = ({
  userLocation,
  deliveryBoyLocation,
}: {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}) => {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/17627/17627470.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });

  const center = [userLocation.latitude, userLocation.longitude];

  console.log(deliveryBoyLocation);
  console.log(userLocation);
  const linePosition =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-[500] rounded-xl overflow-hidden shadow relative z-40">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <Recenter position={center as [number, number]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Order Location</Popup>
        </Marker>
        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline positions={linePosition as any} color="green" />
        {/* <DraggableMarker /> */}
      </MapContainer>
    </div>
  );
};

export default LiveMap;

// "use client";
// import { UserI } from "@/models/user.model";
// import { RootState } from "@/redux/store";
// import axios from "axios";
// import mongoose from "mongoose";
// import React, { use, useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// interface props {
//   params: Promise<{ orderId: string }>;
// }

// interface IOrder {
//   _id: mongoose.Types.ObjectId;
//   user: mongoose.Types.ObjectId;
//   items: [
//     {
//       grocery: mongoose.Types.ObjectId;
//       name: string;
//       price: string;
//       unit: string;
//       image: string;
//       quantity: number;
//     },
//   ];
//   totalAmount: number;
//   paymentMethod: "cod" | "online";
//   address: {
//     fullName: string;
//     city: string;
//     state: string;
//     pinCode: number;
//     fullAddress: string;
//     mobile: string;
//     latitude: number;
//     longitude: number;
//   };
//   isPaid: boolean;
//   assignment?: mongoose.Types.ObjectId;
//   assigndDeliveryBoy?: UserI;
//   status: "pending" | "out of delivery" | "delivered";
//   deliveryFee: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface ILocation {
//   latitude: number;
//   longitude: number;
// }

// const TrackOrder = ({ params }: props) => {
//   const { orderId } = use(params);
//   const [order, setOrder] = useState<IOrder>();
//   const { userData } = useSelector((state: RootState) => state.user);

//   const [userLocation, setUserLoacation] = useState<ILocation>({
//     latitude: 0,
//     longitude: 0,
//   });
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
//     latitude: 0,
//     longitude: 0,
//   });

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const result = await axios.get(`/api/user/get-order/${orderId}`);
//         setUserLoacation({
//           latitude: result.data.address.latitude,
//           longitude: result.data.address.longitude,
//         });
//         setDeliveryBoyLocation({
//           latitude: result.data.assignDeliveryBoy.location.coordinates[1],
//           longitude: result.data.assignDeliveryBoy.location.coordinates[0],
//         });
//         setOrder(result.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchOrder();
//   }, [userData?._id]);

//   return <div>{orderId}</div>;
// };

// export default TrackOrder;
