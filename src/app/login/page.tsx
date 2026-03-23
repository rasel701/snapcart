"use client";
import {
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  LockKeyhole,
  LogIn,
  MailOpen,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import google from "@/assets/google.png";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  console.log(session);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl text-green-700 mb-2 font-extrabold"
      >
        Welcome Back
      </motion.h1>
      <p className="flex items-center text-gray-500">
        Login To Snapcart <Leaf className="text-green-700" />
      </p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-3 mt-5 max-w-sm w-full"
        onSubmit={handleLogin}
      >
        <div className="relative">
          <MailOpen className="absolute top-2 left-4 text-gray-400 " />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <LockKeyhole className="absolute top-2 left-4 text-gray-400 " />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border-2 border-gray-300 py-2 pl-10 pr-6 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 "
            value={user.password}
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

        {(() => {
          const formValidation = user.email !== "" && user.password !== "";
          return (
            <button
              type="submit"
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${formValidation ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          );
        })()}

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
          <span className="flex-1 h-px border-1 border-gray-300"></span>
          OR
          <span className="flex-1 h-px border-1  border-gray-300"></span>
        </div>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-2 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer"
        >
          <Image src={google} width={20} height={20} alt="google" />
          Continue with Google
        </button>
      </motion.form>
      <p className="flex justify-center items-center gap-1 mt-4 text-gray-500">
        Want to create an account ? <LogIn className="w-4 h-4 text-gray-400" />{" "}
        <span
          className="text-green-600 font-semibold cursor-pointer hover:text-green-800 transition-all duration-100"
          onClick={() => router.push("/register")}
        >
          {" "}
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
