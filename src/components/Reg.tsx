import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  MailOpen,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";

type protoType = {
  nextStep: (x: number) => void;
};

const Register = ({ nextStep }: protoType) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <div
        className="flex justify-center items-center px-5 bg-green-500 py-2 rounded-lg cursor-pointer text-white absolute top-5 left-3"
        onClick={() => nextStep(1)}
      >
        {" "}
        <ArrowLeft className="w-5" />
        <span>Back</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl text-green-700 mb-2 font-extrabold"
      >
        Create Account
      </motion.h1>
      <p className="flex items-center text-gray-500">
        Join Snapcart today <Leaf className="text-green-700" />
      </p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-3 mt-5 max-w-sm w-full"
      >
        <div className="relative">
          <User className="absolute top-2 left-4 text-gray-400 " />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="relative">
          <MailOpen className="absolute top-2 left-4 text-gray-400 " />
          <input
            type="text"
            placeholder="Your Email"
            className="w-full border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <LockKeyhole className="absolute top-2 left-4 text-gray-400 " />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          {showPassword ? (
            <Eye
              className="absolute right-3 text-gray-400 cursor-pointer top-3"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeOff
              className="absolute right-3 text-gray-400 cursor-pointer top-3"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default Register;
