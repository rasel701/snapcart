import { IDeliveryAssignment } from "@/models/deliveryAssignment.model";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import mongoose from "mongoose";

type StatusKey = "brodcasted" | "out of delivery" | "delivered" | "pending";

const statusConfig: Record<
  StatusKey,
  { label: string; badgeCls: string; dotCls: string; textCls: string }
> = {
  brodcasted: {
    label: "Broadcasted",
    badgeCls: "bg-green-100",
    dotCls: "bg-green-400",
    textCls: "text-green-700",
  },
  "out of delivery": {
    label: "Out for Delivery",
    badgeCls: "bg-emerald-100",
    dotCls: "bg-emerald-500",
    textCls: "text-emerald-700",
  },
  delivered: {
    label: "Delivered",
    badgeCls: "bg-green-200",
    dotCls: "bg-green-600",
    textCls: "text-green-800",
  },
  pending: {
    label: "Pending",
    badgeCls: "bg-gray-100",
    dotCls: "bg-gray-400",
    textCls: "text-gray-500",
  },
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
};

interface IItems {
  grocery: mongoose.Types.ObjectId;
  name: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
}

const AssignmentsCart = ({
  assignment,
}: {
  assignment: IDeliveryAssignment;
}) => {
  const order = assignment.order as unknown as IOrder;
  const items: IItems[] = order?.items ?? [];
  const firstItem = items[0];
  const rawStatus: string = assignment.status ?? order?.status ?? "pending";
  const status =
    rawStatus in statusConfig ? (rawStatus as StatusKey) : "pending";
  const s = statusConfig[status];

  const shortId = String(order?._id ?? "")
    .slice(10)
    .toUpperCase();

    

    const handleAccept=async()=>{
      try {
        const result = await axios.get(`/api/delivery/assignment/${assignment._id}/accept-assignment`)
        console.log(result)
        
      } catch (error) {
        console.log(error)
        
      }
    }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-100/60 overflow-hidden font-sans">
      {/* Green accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-400" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Order ID
          </p>
          <p className="mt-0.5 text-base font-bold tracking-tight text-gray-900">
            #{shortId}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${s.badgeCls} ${s.textCls}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dotCls}`} />
          {s.label}
        </span>
      </div>

      <hr className="mx-5 border-gray-100" />

      {/* ── Product Row ── */}
      {firstItem && (
        <div className="flex items-center gap-3 px-5 py-3.5">
          {/* Thumbnail */}
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            {firstItem.image ? (
              <img
                src={firstItem.image}
                alt={firstItem.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">
                🛒
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {firstItem.name}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                Qty: <b>{firstItem.quantity}</b> {firstItem.unit}
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                ৳ {firstItem.price}/{firstItem.unit}
              </span>
            </div>
          </div>

          {/* More items pill */}
          {items.length > 1 && (
            <span className="flex-shrink-0 rounded-lg bg-green-50 px-2 py-1 text-[11px] font-bold text-green-700">
              +{items.length - 1} more
            </span>
          )}
        </div>
      )}

      <hr className="mx-5 border-gray-100" />

      {/* ── Address ── */}
      <div className="flex items-start gap-2.5 px-5 py-3.5">
        <span className="mt-0.5 text-sm">📍</span>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Delivery Address
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-gray-600">
            {order?.address?.fullName && (
              <span className="font-semibold text-gray-900">
                {order.address.fullName} ·{" "}
              </span>
            )}
            {[
              order?.address?.city,
              order?.address?.state,
              order?.address?.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-b border-gray-100">
        {/* Payment */}
        <div className="flex flex-col gap-1 bg-white px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Payment
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs">
              {order?.paymentMethod === "cod" ? "💵" : "💳"}
            </span>
            <span className="text-[13px] font-bold text-gray-700">
              {order?.paymentMethod?.toUpperCase() ?? "—"}
            </span>
          </div>
        </div>

        {/* Paid status */}
        <div className="flex flex-col gap-1 bg-white px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Paid
          </p>
          <span
            className={`w-fit rounded-md px-2 py-0.5 text-[11px] font-bold ${
              order?.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-red-50 text-red-500"
            }`}
          >
            {order?.isPaid ? "Yes" : "No"}
          </span>
        </div>

        {/* Total */}
        <div className="flex flex-col gap-1 bg-green-50 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Total
          </p>
          <p className="text-base font-extrabold tracking-tight text-green-700">
            ৳ {order?.totalAmount ?? 0}
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-[11px] text-gray-400">
          🕐 {formatDate(assignment.createdAt as any)}
        </span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-95">
            Reject
          </button>
          <button className="rounded-lg bg-gradient-to-br from-green-500 to-green-700 px-4 py-1.5 text-[12px] font-semibold text-white shadow-md shadow-green-200 transition hover:brightness-105 active:scale-95"  onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsCart;
