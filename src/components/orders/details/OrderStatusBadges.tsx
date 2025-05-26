
import { StatusBadge } from "@/components/ui/status-badge";
import { OrderStatus, PaymentStatus } from "@/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge status={status} type="order" />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge status={status} type="payment" />;
}
