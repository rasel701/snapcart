import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface IItems {
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
}

function lineItemFun(items: IItems[]) {
  const BDT_TO_USD_RATE = 120;

  return items.map((item: IItems) => {
    const itemPriceInBDT = Number(item.price);
    const unitAmountInUSD = Math.round(
      (itemPriceInBDT / BDT_TO_USD_RATE) * 100,
    );

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: unitAmountInUSD,
      },
      quantity: item.quantity,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        {
          message: "please send all creentials",
        },
        { status: 400 },
      );
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const newOrder = await orderModel.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: lineItemFun(items),
      metadata: { orderId: newOrder._id.toString(), userId: userId.toString() },
    });
    return NextResponse.json(
      {
        url: session.url,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("stripe error :", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
