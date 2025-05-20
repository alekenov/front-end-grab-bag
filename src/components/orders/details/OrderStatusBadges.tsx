
import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'processing': return 'default';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status === 'new' ? 'Новый' : 
       status === 'processing' ? 'В обработке' : 
       status === 'completed' ? 'Выполнен' : 'Отменен'}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Badge variant={getPaymentStatusBadgeVariant(status)}>
      {status === 'paid' ? 'Оплачен' : 
       status === 'pending' ? 'Ожидает оплаты' : 
       status === 'refunded' ? 'Возврат средств' : 'Отменен'}
    </Badge>
  );
}
