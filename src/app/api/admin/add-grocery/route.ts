import { auth } from "@/auth";
import uploadCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          message: "Unauthorized: You are not an admin",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;

    if (!name || !category || !unit || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadCloudinary(file);
    }

    const grocery = await groceryModel.create({
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });
    return NextResponse.json(
      { message: "Grocery added successfully", grocery },
      { status: 201 },
    );
  } catch (error) {
    console.log(`Add grocery error`, error);
    return NextResponse.json(
      {
        message: `Internal Server Error`,
      },
      { status: 500 },
    );
  }
}
