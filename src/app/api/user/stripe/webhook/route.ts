import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Signature verification failed:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await connectDB();

    const orderId = session.metadata?.orderId;

    if (orderId) {
      const updatedOrder = await orderModel
        .findByIdAndUpdate(
          orderId,
          {
            isPaid: true,

            paymentId: session.payment_intent as string,
          },
          { new: true },
        )
        .populate("user");

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/api/internal/order-notify`,
          {
            orderItem: updatedOrder,
            orderId: updatedOrder?._id,
            customerName: updatedOrder?.user?.name || "Online Customer",
            amount: session.amount_total ? session.amount_total / 100 : 0,
          },
        );
      } catch (error) {
        console.log("Socket notify error:", error);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
