"use client";
import { Search, SearchAlert, ShoppingCartIcon, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DropDown from "./DropDown";
import { div } from "motion/react-client";

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
  const [open, setOpen] = useState<boolean>(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

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

  return (
    <div className="relative">
      <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-18 px-4">
        <Link
          href={"/"}
          className="text-xl font-bold text-white tracking-wide hover:scale-105 transition-transform"
        >
          Snapcart
        </Link>
        <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search groceries..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </form>

        <div className="flex items-center gap-2 md:gap-6 relative">
          <div
            className="md:hidden items-center bg-white rounded-full px-4 py-2 w-16 max-w-lg shadow-md"
            onClick={() => setSearchBarOpen((prev) => !prev)}
          >
            <SearchAlert />
          </div>

          <Link
            href={""}
            className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-all"
          >
            <ShoppingCartIcon className="text-green-600" />
            <span className="bg-red-500 w-5 h-5 flex justify-center items-center rounded-lg absolute -top-1 right-0 text-white">
              0
            </span>
          </Link>
          <div
            className="relative"
            onClick={() => setOpen((prev) => !prev)}
            ref={profileDropDown}
          >
            <div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt="user"
                  width={50}
                  height={50}
                  className="rounded-full cursor-pointer hover:scale-105  transition-all"
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
    </div>
  );
};

export default Nav;
