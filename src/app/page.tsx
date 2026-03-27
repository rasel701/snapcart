import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DelivaryDashboard from "@/components/DelivaryDashboard";
import EditAndPassword from "@/components/EditAndPassword";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  await connectDB();

  const userDoc = await userModel.findById(session.user.id);
  const user = JSON.parse(JSON.stringify(userDoc));

  if (!user) {
    return redirect("/login");
  }

  const isInComplete = !user.mobile || !user.role;

  if (isInComplete) {
    return <EditAndPassword />;
  }

  return (
    <>
      <Nav user={user} />
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        user.role === "delivery" && <DelivaryDashboard />
      )}
    </>
  );
};

export default Home;
