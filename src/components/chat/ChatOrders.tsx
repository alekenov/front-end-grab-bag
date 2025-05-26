
import { useMemo, useEffect } from "react";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
import { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingBag, ArrowRight, MapPin, User, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatOrdersProps {
  chatId: string | null;
}

export function ChatOrders({ chatId }: ChatOrdersProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  const formatDeliveryAddress = (address: string | null) => {
    if (!address) return null;
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
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
      <div className="flex flex-col items-center justify-center p-8">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-center text-gray-500 font-medium mb-2">Нет заказов из этого чата</p>
        <p className="text-sm text-gray-400 text-center mb-4">
          Создайте первый заказ для этого клиента
        </p>
        <Button 
          variant="outline"
          onClick={() => {
            console.log("Navigate to create new order from chat");
            navigate("/orders/new");
          }}
        >
          Создать заказ
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="px-4 pb-4 space-y-4">
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} mb-4`}>
          <h3 className="font-medium text-lg">Заказы из этого чата</h3>
          <Button 
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={isMobile ? "w-full" : ""}
            onClick={() => {
              console.log("Navigate to create new order from chat");
              navigate("/orders/new");
            }}
          >
            Создать заказ
          </Button>
        </div>
        
        <div className="space-y-3">
          {sortedOrders.map(order => (
            <Card 
              key={order.id} 
              className="relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow w-full"
              onClick={() => goToOrderDetails(order.id)}
            >
              <CardContent className="p-4 w-full">
                <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'} mb-3`}>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        #{order.id.substring(0, 8)}
                      </span>
                      {getStatusBadge(order.status as OrderStatus)}
                    </div>
                    
                    {/* Информация о клиенте */}
                    <p className="font-medium text-gray-900 mb-1">
                      {order.customer_name || 'Неизвестный клиент'}
                    </p>
                    
                    {/* Дата создания */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}</span>
                    </div>
                    
                    {/* Информация о товарах */}
                    {order.items && order.items.length > 0 && (
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Товаров: {order.items.length}</span>
                      </div>
                    )}
                    
                    {/* Адрес доставки */}
                    {order.delivery_address && (
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{formatDeliveryAddress(order.delivery_address)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`${isMobile ? 'flex justify-between items-center mt-3 w-full' : 'text-right'}`}>
                    <p className="font-semibold text-lg text-gray-900">
                      {order.total_amount.toLocaleString()} ₸
                    </p>
                    
                    {!isMobile && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToOrderDetails(order.id);
                        }}
                      >
                        Детали
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Мобильная кнопка детали */}
                {isMobile && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToOrderDetails(order.id);
                    }}
                  >
                    Подробнее
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
