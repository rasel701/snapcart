"use client";
import {
  Boxes,
  ClipboardCheck,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  SearchAlert,
  ShoppingCartIcon,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DropDown from "./DropDown";
import { signOut, useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface User {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "delivery" | "admin";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const Nav = ({ user }: { user: User }) => {
  const { cartData } = useSelector((state: RootState) => state.cart);

  const [open, setOpen] = useState<boolean>(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const { data } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const profileDropDown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const sideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100 }}
            transition={{ type: "spring", damping: 14 }}
            className="md:hidden fixed top-0 left-0 h-full w-[65%] sm:w-[50%] z-9999 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/80 backdrop-blur-xl border-r border-gray-400/20"
          >
            <div className="flex justify-between items-center mb-2 px-3 my-2">
              <h2 className="font-extrabold text-2xl tracking-wide text-white/90">
                Admin Panel
              </h2>
              <button
                className="text-white/90 hover:text-red-400 text-2xl font-bold transition cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <XCircle />
              </button>
            </div>
            <div className="flex gap-3 items-center px-5 bg-white/15 w-[90%] mx-2 py-2 rounded-full">
              <div className="flex justify-center items-center  h-10 w-10  rounded-full    bg-white">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="user"
                    width={50}
                    height={50}
                    className="w-full h-full rounded-full cursor-pointer hover:scale-105  transition-all"
                  />
                ) : (
                  <User />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <p className="text-white/80">{user.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-6 text-white">
              <Link
                href={`/admin/add-grocery`}
                className="flex items-center bg-white/10 w-[80%]  justify-center p-3 rounded-lg gap-3 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle />
                Add Grocery
              </Link>
              <Link
                href={``}
                className="flex items-center bg-white/10 w-[80%]  justify-center p-3 rounded-lg gap-3 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes />
                View Grocery
              </Link>
              <Link
                href={``}
                className="flex items-center bg-white/10 w-[80%]  justify-center p-3 rounded-lg gap-3 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardCheck />
                Manage Orders
              </Link>
            </div>
            <div className="my-5 border-t border-white/20"></div>
            <div
              className="bg-white/20 m-2 flex items-center gap-3 text-red-400 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
              onClick={async () => await signOut({ callbackUrl: "/" })}
            >
              <LogOut className="text-red-400" />
              LogOut
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className="relative">
      <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-18 px-4 z-50">
        <Link
          href={"/"}
          className="text-xl font-bold text-white tracking-wide hover:scale-105 transition-transform"
        >
          Snapcart
        </Link>
        {data?.user?.role === "user" && (
          <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
            <Search className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search groceries..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </form>
        )}

        <div className="flex items-center gap-2 md:gap-6 relative">
          {data?.user?.role === "user" && (
            <div
              className="md:hidden items-center bg-white rounded-full px-4 py-2 w-16 max-w-lg shadow-md"
              onClick={() => setSearchBarOpen((prev) => !prev)}
            >
              <SearchAlert />
            </div>
          )}

          {data?.user?.role === "user" && (
            <Link
              href={""}
              className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-all"
            >
              <ShoppingCartIcon className="text-green-600" />
              <span className="bg-red-500 w-5 h-5 flex justify-center items-center rounded-lg absolute -top-1 right-0 text-white">
                {cartData.length}
              </span>
            </Link>
          )}
          <div>
            {data?.user?.role === "admin" && (
              <div className="hidden md:flex items-center gap-4 ">
                <Link
                  href={`/admin/add-grocery`}
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <PlusCircle />
                  Add Grocery
                </Link>
                <Link
                  href={``}
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <Boxes />
                  View Grocery
                </Link>
                <Link
                  href={``}
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <ClipboardCheck />
                  Manage Orders
                </Link>
              </div>
            )}
            <div
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu />
            </div>
          </div>

          <div
            className="relative"
            onClick={() => setOpen((prev) => !prev)}
            ref={profileDropDown}
          >
            <div className="flex justify-center items-center  h-10 w-10  rounded-full    bg-white">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="user"
                  width={50}
                  height={50}
                  className="w-full h-full rounded-full cursor-pointer hover:scale-105  transition-all"
                />
              ) : (
                <User />
              )}
            </div>
            {open && (
              <DropDown
                user={{ name: user.name, image: user.image, role: user.role }}
                setFun={setOpen}
              ></DropDown>
            )}
          </div>
        </div>
      </div>
      {searchBarOpen && (
        <div className="w-[80%] bg-white  rounded-full absolute flex  px-4 py-3 items-center top-26 mx-auto left-1/2 -translate-x-1/2 md:hidden">
          <Search className="text-gray-600  w-6 h-6" />
          <input
            type="text"
            className="w-full outline-none text-gray-700 px-2"
            placeholder="Search groceries..."
          />
          <X
            className="text-gray-500 "
            onClick={() => setSearchBarOpen(false)}
          />
        </div>
      )}
      {sideBar}
    </div>
  );
};

export default Nav;
