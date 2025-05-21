
import { useState, useEffect } from "react";
import { useOrdersApi } from "@/hooks";
import { OrdersFilter, OrderStatus, PaymentStatus, Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, FilterX, Clock, MapPin, User, Truck, Package } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderStatusActions } from "./details/OrderStatusActions";

// Добавляем массив тестовых заказов для демонстрации
const DEMO_RESPONSIBLE_MANAGERS = [
  "Алексей Смирнов", 
  "Елена Петрова", 
  "Дмитрий Иванов", 
  "Анна Козлова", 
  "Сергей Соколов"
];

export function OrdersList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<OrdersFilter>({});
  const { getOrders, updateOrder } = useOrdersApi();
  const { data: orders = [], isLoading } = getOrders(filters);
  const isMobile = useIsMobile();

  // Эффект для логирования
  useEffect(() => {
    console.log("OrdersList mounted with filters:", filters);
    console.log("OrdersList current orders data:", orders);
    console.log("Is mobile view:", isMobile);
    return () => {
      console.log("OrdersList unmounted");
    };
  }, [filters, orders, isMobile]);

  const handleFilterChange = (key: keyof OrdersFilter, value: any) => {
    console.log(`Changing filter "${key}" to:`, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Новый</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">В обработке</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Выполнен</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Отменен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Ожидает</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Оплачен</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Отменен</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Возврат</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const viewOrderDetails = (orderId: string) => {
    console.log("Navigating to order details for ID:", orderId);
    navigate(`/orders/${orderId}`);
  };
  
  const handleOrderAction = (orderId: string, action: string) => {
    if (action === "view") {
      viewOrderDetails(orderId);
      return;
    }
    
    // Обновляем статус заказа
    updateOrder.mutate({
      id: orderId,
      data: {
        status: action as OrderStatus
      }
    });
  };

  // Получаем изображение товара для карточки
  const getOrderImage = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      return null;
    }
    
    // Возвращаем изображение первого товара
    return order.items[0].product_image;
  };

  // Функция для определения, нужно ли показывать информацию о времени доставки
  const shouldShowDeliveryTime = (order: Order) => {
    return order.status === 'processing' && order.estimated_delivery_time;
  };

  // Функция для определения, нужно ли показывать ответственного менеджера
  const shouldShowManager = (order: Order) => {
    return (order.status === 'processing' || order.status === 'completed') && order.responsible_manager;
  };

  // Функция для форматирования адреса доставки
  const formatDeliveryAddress = (address: string | null) => {
    if (!address) return null;
    // Если адрес слишком длинный, обрезаем его
    return address.length > 40 ? address.substring(0, 40) + '...' : address;
  };

  // Мобильная карточка заказа
  const MobileOrderCard = ({ order }: { order: Order }) => {
    const orderImage = getOrderImage(order);
    const itemsCount = order.items?.length || 0;

    // Если отсутствуют данные о менеджере или времени доставки, добавим их для демонстрации
    const demoOrder = { 
      ...order,
      responsible_manager: order.responsible_manager || 
        (order.status !== 'new' ? DEMO_RESPONSIBLE_MANAGERS[Math.floor(Math.random() * DEMO_RESPONSIBLE_MANAGERS.length)] : undefined),
      estimated_delivery_time: order.estimated_delivery_time || 
        (order.status === 'processing' ? `${Math.floor(Math.random() * 60) + 30} минут` : undefined)
    };

    return (
      <div 
        className="bg-white p-4 rounded-lg border mb-3 shadow-sm"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex">
            {orderImage && (
              <div className="w-20 h-20 rounded overflow-hidden mr-3 flex-shrink-0">
                <img 
                  src={orderImage} 
                  alt="Товар" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{order.id.substring(0, 8)}</span>
                {getStatusBadge(order.status as OrderStatus)}
              </div>
              <p className="font-medium mt-1">{demoOrder.customer_name || 'Неизвестный клиент'}</p>
              {order.customer_phone && (
                <p className="text-xs text-gray-500">{order.customer_phone}</p>
              )}
              {itemsCount > 0 && (
                <div className="flex items-center mt-1">
                  <Package className="h-3 w-3 mr-1 text-gray-500" />
                  <p className="text-xs text-gray-500">Товаров: {itemsCount}</p>
                </div>
              )}
            </div>
          </div>
          <p className="font-semibold text-lg">{order.total_amount.toLocaleString()} ₸</p>
        </div>

        {/* Информация о доставке */}
        {order.delivery_address && (
          <div className="flex items-center text-xs text-gray-600 mb-1.5">
            <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{formatDeliveryAddress(order.delivery_address)}</span>
          </div>
        )}
        
        {/* Информация о времени создания */}
        <div className="flex items-center text-xs text-gray-600 mb-1.5">
          <Calendar className="h-3 w-3 mr-1.5" />
          <span>{format(new Date(order.created_at), "dd.MM.yyyy")} ({formatDistanceToNow(new Date(order.created_at), {addSuffix: true})})</span>
        </div>

        {/* Показываем ответственного менеджера */}
        {shouldShowManager(demoOrder) && (
          <div className="flex items-center text-xs text-gray-600 mb-1.5">
            <User className="h-3 w-3 mr-1.5" />
            <span>Ответственный: {demoOrder.responsible_manager}</span>
          </div>
        )}

        {/* Показываем примерное время доставки */}
        {shouldShowDeliveryTime(demoOrder) && (
          <div className="flex items-center text-xs text-gray-600 mb-1.5">
            <Truck className="h-3 w-3 mr-1.5" />
            <span>Примерное время доставки: {demoOrder.estimated_delivery_time}</span>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-3">
          <OrderStatusActions 
            status={order.status as OrderStatus} 
            onClick={(action) => handleOrderAction(order.id, action)}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => viewOrderDetails(order.id)}
          >
            Детали
          </Button>
        </div>
      </div>
    );
  };

  // Добавим логирование для отладки
  console.log("OrdersList rendering with orders:", orders);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Заказы</h2>
        <Button 
          onClick={() => {
            console.log("Navigating to create new order form");
            navigate("/orders/new");
          }}
        >
          Новый заказ
        </Button>
      </div>

      <div className="bg-white p-3 rounded-lg shadow-sm">
        {/* Компактные фильтры для моб. устройств */}
        {isMobile ? (
          <div className="flex flex-col space-y-2">
            <div className="flex gap-2">
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value || undefined)}
              >
                <SelectTrigger className="flex-1 h-9">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2">
                    <p className="text-sm mb-1">Дата от</p>
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                    <div className="border-t my-2"></div>
                    <p className="text-sm mb-1">Дата до</p>
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск"
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
                  className="pl-8 h-9"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="h-9"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Компактные фильтры для десктопа */
          <div className="flex flex-wrap gap-2 items-center">
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || undefined)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новый</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Выполнен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-start">
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "dd.MM.yyyy")
                    ) : (
                      <span className="text-muted-foreground">От</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-start">
                    {filters.dateTo ? (
                      format(filters.dateTo, "dd.MM.yyyy")
                    ) : (
                      <span className="text-muted-foreground">До</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
                className="w-[200px] pl-8"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilters({})}
              className="ml-1"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Загрузка заказов...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-2">Заказы не найдены</p>
          <p className="text-sm text-gray-400">
            {Object.keys(filters).length > 0
              ? "Попробуйте изменить параметры поиска"
              : "Создайте новый заказ, нажав на кнопку «Новый заказ»"}
          </p>
        </div>
      ) : isMobile ? (
        // Мобильная версия списка заказов с ScrollArea для скроллинга
        <ScrollArea className="h-[calc(100vh-270px)] pr-4">
          <div className="space-y-2">
            {orders.map((order: Order) => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        // Десктопная версия в виде таблицы
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ScrollArea className="h-[calc(100vh-270px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Товары</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: Order) => (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-gray-50" 
                  >
                    <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        {order.customer_name || 'Неизвестный клиент'}
                        {order.customer_phone && <div className="text-xs text-gray-500">{order.customer_phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {order.items && order.items.length > 0 && order.items[0].product_image && (
                          <img 
                            src={order.items[0].product_image} 
                            alt="Товар" 
                            className="w-10 h-10 object-cover rounded mr-2" 
                          />
                        )}
                        <span className="text-sm">{order.items?.length || 0} шт.</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{order.total_amount.toLocaleString()} ₸</TableCell>
                    <TableCell>{getStatusBadge(order.status as OrderStatus)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <OrderStatusActions 
                          status={order.status as OrderStatus} 
                          onClick={(action) => handleOrderAction(order.id, action)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrderDetails(order.id)}
                        >
                          Детали
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
