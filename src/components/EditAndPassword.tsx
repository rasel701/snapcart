"use client";
import axios from "axios";
import { BikeIcon, Info, UserCog, UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

const EditAndPassword = () => {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: <UserCog /> },
    { id: "user", label: "User", icon: <UserIcon /> },
    { id: "delivery", label: "Delivery", icon: <BikeIcon /> },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const isMobileValid = mobile.length === 11;
  const router = useRouter();

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-user", {
        role: selectedRole,
        mobile,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 w-full">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          return (
            <motion.div
              whileTap={{ scale: 2, rotate: 3 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              key={role.id}
              className={`border-2 border-gray-300 shadow-2xl px-4 py-3 flex flex-col justify-center items-center rounded-xl  hover:border-green-400 transition-all cursor-pointer bg-gray-100 text-gray-600 ${selectedRole === role.id ? "bg-green-600 text-white" : ""}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div>{role.icon}</div>
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex flex-col items-center mt-10"
      >
        <label className="text-gray-700 font-medium mb-2" htmlFor="mobile">
          Enter Your Mobile No.
        </label>
        <input
          type="tel"
          id="mobile"
          className="w-64 md:w-80 border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
          placeholder="0000000000"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
        />
        <AnimatePresence>
          {mobile.length > 0 && !isMobileValid && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, x: [0, -5, 5, -5, 5, 0] }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-2 flex items-center gap-1"
            >
              <Info size={14} /> Mobile number must be 11 digits
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.button
        initial={{ y: -20 }}
        disabled={!mobile || !selectedRole}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
        className={` w-64 md:w-80 py-2 text-lg rounded-lg mx-auto mt-10 text-white shadow-xl ${mobile || selectedRole ? "bg-green-700 cursor-pointer" : "bg-gray-600 cursor-not-allowed "} `}
        onClick={handleEdit}
      >
        Submit
      </motion.button>
    </div>
  );
};

export default EditAndPassword;
