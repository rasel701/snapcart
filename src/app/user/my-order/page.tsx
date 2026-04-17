"use client";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {motion} from "motion/react"
import UserOrderCart from "@/components/UserOrderCart";

const MyOrder = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const getMyOrder = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        console.log(result.data);
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrder();
  }, []);
  const router = useRouter();
  return (
    <div className="bg-linear-tob from-white to-gray-600 min-h-[200vh] ">
      <h2 className="flex  items-center border-b mb-5 py-5 fixed w-full top-0  px-15 bg-gray-100 shadow-2xl border-gray-400">
        <div
          className="bg-green-100 p-2 mr-3 rounded-full cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={30} />
        </div>
        <span className="text-2xl font-bold mb-1 text-gray-600">
          {" "}
          My Orders
        </span>
      </h2>
   <div className="">
    {orders?.length==0?<div className="pt-20 flex flex-col items-center text-center justify-center mt-40">
<PackageSearch size={70} className="text-green-600 mb-4" />
<h2 className="text-xl font-semibold text-gray-700">No Orders Found</h2>
<p className="text-gray-500 text-sm mt-1">Start shopping to view your orders here.</p>

    </div>:<div className="mt-34 space-y-6 w-full md:w-[70%] mx-auto">
      
        {
          orders?.map(order=>(
           <motion.div key={order._id.toString()}
           initial={{opacity:0, y:20}}
           animate={{opacity:1,y:0}}
           transition={{duration:0.4}}
           >
            <UserOrderCart order={order} />
           </motion.div>

          )

          )
        }

      
    
      </div>}
   </div>

    </div>
  );
};

export default MyOrder;
