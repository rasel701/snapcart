import { auth } from "@/auth";
import UserTrackOrder from "@/components/UserTrackOrder";
import orderModel from "@/models/order.model";
import userModel from "@/models/user.model";

interface Props {
  params: Promise<{ orderId: string }>;
}

const TrackOrder = async ({ params }: Props) => {
  const { orderId } = await params;
  const session = await auth();

  const orderData = await orderModel
    .findById(orderId)
    .populate("assigndDeliveryBoy");
  const userData = await userModel.findById(session?.user?.id);
  const orderItem = JSON.parse(JSON.stringify(orderData));
  const deliveryBoyLoc = orderItem.assigndDeliveryBoy.location.coordinates;
  const userLoc = userData.location.coordinates;

  return (
    <>
      <UserTrackOrder
        deliveryBoyLoc={deliveryBoyLoc}
        userLoc={userLoc}
        order={orderItem}
        userId={session?.user?.id}
        role={session?.user?.role}
      />
    </>
  );
};

export default TrackOrder;
