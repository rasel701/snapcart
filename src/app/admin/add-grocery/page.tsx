"use client";
import { Loader, MoveLeft, PlusCircle, UploadCloud } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";

interface IGrocery {
  name: string;
  category: string;
  price: string;
  unit: string;
  image: File | string;
}

const AddGrocery = () => {
  const catagories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Packaged Food",
    "Baby & Pet Care",
  ];

  const units = ["kg", "g", "liter", "ml", "price", "pack"];

  const [grocery, setGrocery] = useState<IGrocery>({
    name: "",
    category: "",
    unit: "",
    price: "",
    image: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGrocery({ ...grocery, image: file });
    setPreview(URL.createObjectURL(file));
  };

  console.log(grocery);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", grocery.name);
      formData.append("category", grocery.category);
      formData.append("price", grocery.price);
      formData.append("unit", grocery.unit);
      if (grocery.image) {
        formData.append("image", grocery.image);
      }
      const result = await axios.post("/api/admin/add-grocery", formData);
      if (result.data) {
        setLoading(false);
        setPreview(null);
        setGrocery({
          name: "",
          category: "",
          unit: "",
          price: "",
          image: "",
        });
      }
    } catch (error) {
      console.log("Error response:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative">
      <Link
        href={"/"}
        className="absolute flex items-center justify-center text-[20px] bg-white text-green-500 px-6 py-2 rounded-full gap-1 cursor-pointer hover:bg-white/20 transition-all top-6 left-8 shadow-xl"
      >
        <MoveLeft />
        <span className="hidden md:flex">Back</span>
      </Link>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-2xl border border-gray-100 p-8 mt-9 shadow-xl rounded-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-green-600" />
            <h2>Add Your Grocery</h2>
          </div>
          <p className="text-green-500 text-sm text-center">
            Fill out the details below to add a new grocery item
          </p>
        </div>
        <form className="flex flex-col gap-6 w-full " onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={grocery.name}
              onChange={(e) => setGrocery({ ...grocery, name: e.target.value })}
              placeholder="grocery name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
            <div>
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium mb-1"
              >
                Category<span className="text-red-500">*</span>
              </label>
              <select
                value={grocery.category}
                onChange={(e) =>
                  setGrocery({ ...grocery, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                <option value={""}>Select Category</option>
                {catagories.map((cat, index) => {
                  return (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Unit<span className="text-red-500">*</span>
              </label>
              <select
                id="unit"
                value={grocery.unit}
                onChange={(e) =>
                  setGrocery({ ...grocery, unit: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                <option value={""}>Select Unit</option>
                {units.map((uni, index) => {
                  return (
                    <option key={index} value={uni}>
                      {uni}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              value={grocery.price}
              onChange={(e) =>
                setGrocery({ ...grocery, price: e.target.value })
              }
              placeholder="price"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="flex gap-2 items-center flex-col md:flex-row">
            <label
              htmlFor="image"
              className="flex items-center justify-center gap-2 text-gray-700 font-medium mb-1 bg-green-500 px-3 py-2 rounded-xl "
            >
              <UploadCloud /> Upload Image
            </label>
            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              placeholder="price"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            {preview && (
              <Image
                src={preview}
                alt="image"
                width={100}
                height={100}
                className="rounded-xl shadow-md border border-gray-200 object-cover mt-2"
              />
            )}
          </div>
          <motion.button
            disabled={loading === true}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader className="text-white animate-spin" />
            ) : (
              " Add Grocery"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
