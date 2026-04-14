import connectDB from "@/lib/db";
import orderModel from "@/models/order.model";
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
      await orderModel.findByIdAndUpdate(orderId, {
        isPaid: true,

        paymentId: session.payment_intent as string,
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
