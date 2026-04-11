"use client";
import MapView from "@/components/MapView";
import { RootState } from "@/redux/store";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  ArrowLeft,
  Building,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  PinIcon,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface addressI {
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mainLocationLoading, setMainLocationLoading] =
    useState<boolean>(false);
  const [address, setAddress] = useState<addressI>({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  console.log(userData?.name);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mainPosition, setMainPositon] = useState<[number, number] | null>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQuery = async () => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();

    const results = await provider.search({ query: searchQuery });
    if (results && results.length > 0) {
      const { x, y, raw, label } = results[0];
      setPosition([y, x]);
      setSearchLoading(false);
    } else {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        console.log(result.data);
        setAddress({
          ...address,
          city: result.data.address.county,
          state: result.data.address.state,
          pincode: result.data.address.postcode || "",
          fullAddress: result.data.display_name,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddress();
  }, [position]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setMainPositon([latitude, longitude]);
        },
        (error) => console.log("location error ", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  const handleGoToMainPosition = (): void => {
    if (navigator.geolocation) {
      setMainLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setMainLocationLoading(false);
        },
        (error) => console.log("location error ", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft />
        <span> Back to cart</span>
      </motion.button>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-4 text-green-600"
                size={18}
              />
              <input
                type="text"
                placeholder={address.fullName || userData?.name}
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-4 text-green-600"
                size={18}
              />
              <input
                type="text"
                placeholder={address.mobile || userData?.mobile}
                className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <Home
                className="absolute left-3 top-4 text-green-600"
                size={18}
              />
              <input
                type="text"
                placeholder={"Full-Address"}
                className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-4 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={"City"}
                  className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-4 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={"State"}
                  className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <PinIcon
                  className="absolute left-3 top-4 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={"Pin-code"}
                  className="pl-10 w-full border rounded-lg p-3 font-bold bg-gray-50"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search city or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
              />
              <button
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium focus:outline-none"
                disabled={searchLoading}
                onClick={handleSearchQuery}
              >
                {searchLoading ? <Loader2 /> : "Search"}
              </button>
            </div>
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <MapView
                position={position}
                setPosition={setPosition}
                address={address}
                handleGoToMainPosition={handleGoToMainPosition}
                mainLocationLoading={mainLocationLoading}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
