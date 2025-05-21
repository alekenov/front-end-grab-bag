
import { useMemo, useEffect } from "react";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
import { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatOrdersProps {
  chatId: string | null;
}

export function ChatOrders({ chatId }: ChatOrdersProps) {
  const navigate = useNavigate();
  const { getOrdersByChatId } = useOrdersApi();
  const { data: orders = [], isLoading } = getOrdersByChatId(chatId || "");
  
  // Добавим логирование для отладки
  useEffect(() => {
    console.log("ChatOrders rendered with chatId:", chatId);
    console.log("ChatOrders current orders:", orders);
  }, [chatId, orders]);
  
  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [orders]);
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Новый</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">В обработке</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Выполнен</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Отменен</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  const goToOrderDetails = (orderId: string) => {
    console.log("ChatOrders: Navigating to order details:", orderId);
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        Загрузка заказов...
      </div>
    );
  }
  
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-center text-sm text-gray-500">Нет заказов из этого чата</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Заказы из этого чата</h3>
        <Button 
          variant="outline"
          size="sm" 
          onClick={() => {
            console.log("Navigate to create new order from chat");
            navigate("/orders/new");
          }}
        >
          Создать заказ
        </Button>
      </div>
      
      {sortedOrders.map(order => (
        <Card 
          key={order.id} 
          className="relative overflow-hidden group cursor-pointer"
          onClick={() => goToOrderDetails(order.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium">
                  Заказ #{order.id.substring(0, 8)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}
                </p>
              </div>
              {getStatusBadge(order.status as OrderStatus)}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">{order.total_amount.toLocaleString()} ₸</p>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  goToOrderDetails(order.id);
                }}
              >
                Детали
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
