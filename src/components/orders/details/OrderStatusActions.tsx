
import { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Package, PackageCheck, Truck, Check, X } from "lucide-react";

interface OrderStatusActionsProps {
  status: OrderStatus;
  onClick: (action: string) => void;
  className?: string;
}

export function OrderStatusActions({ status, onClick, className = "" }: OrderStatusActionsProps) {
  // В зависимости от текущего статуса предлагаем соответствующие действия
  switch (status) {
    case "new":
      return (
        <Button 
          onClick={() => onClick("processing")}
          className={`w-full ${className}`}
          size="sm"
        >
          <Package className="mr-1" size={16} />
          Принять в работу
        </Button>
      );
    case "processing":
      return (
        <Button 
          onClick={() => onClick("completed")}
          className={`w-full ${className}`}
          size="sm"
        >
          <Truck className="mr-1" size={16} />
          Отправить
        </Button>
      );
    case "completed":
      return (
        <Button 
          variant="ghost"
          onClick={() => onClick("view")}
          className={`w-full ${className}`}
          size="sm"
        >
          <Check className="mr-1" size={16} />
          Выполнен
        </Button>
      );
    case "cancelled":
      return (
        <Button 
          variant="ghost"
          onClick={() => onClick("view")}
          className={`w-full ${className}`}
          size="sm"
          disabled
        >
          <X className="mr-1" size={16} />
          Отменен
        </Button>
      );
    default:
      return null;
  }
}
