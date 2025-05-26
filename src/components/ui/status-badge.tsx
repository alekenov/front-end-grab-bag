
import { Badge, BadgeProps } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: OrderStatus | PaymentStatus | string;
  type?: "order" | "payment" | "custom";
  customVariant?: BadgeProps['variant'];
}

export function StatusBadge({ 
  status, 
  type = "custom", 
  customVariant,
  className,
  ...props 
}: StatusBadgeProps) {
  const getOrderStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { variant: 'secondary' as const, label: 'Новый' };
      case 'processing':
        return { variant: 'default' as const, label: 'В обработке' };
      case 'completed':
        return { variant: 'success' as const, label: 'Выполнен' };
      case 'cancelled':
        return { variant: 'destructive' as const, label: 'Отменен' };
      default:
        return { variant: 'outline' as const, label: status };
    }
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return { variant: 'success' as const, label: 'Оплачен' };
      case 'pending':
        return { variant: 'warning' as const, label: 'Ожидает оплаты' };
      case 'cancelled':
        return { variant: 'destructive' as const, label: 'Отменен' };
      case 'refunded':
        return { variant: 'outline' as const, label: 'Возврат средств' };
      default:
        return { variant: 'secondary' as const, label: status };
    }
  };

  let config;
  if (type === "order") {
    config = getOrderStatusConfig(status as OrderStatus);
  } else if (type === "payment") {
    config = getPaymentStatusConfig(status as PaymentStatus);
  } else {
    config = { variant: customVariant || 'default' as const, label: status };
  }

  return (
    <Badge 
      variant={config.variant} 
      className={cn(className)}
      {...props}
    >
      {config.label}
    </Badge>
  );
}
