
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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderStatusActions } from "./details/OrderStatusActions";

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
  
  // Мобильная карточка заказа
  const MobileOrderCard = ({ order }: { order: Order }) => {
    const orderImage = getOrderImage(order);
    const itemsCount = order.items?.length || 0;

    return (
      <div 
        className="bg-white p-3 rounded-lg border mb-3 shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex">
            {orderImage && (
              <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                <img 
                  src={orderImage} 
                  alt="Товар" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="font-mono text-xs">{order.id.substring(0, 8)}</span>
              <p className="font-medium">{order.customer_name || 'Неизвестный клиент'}</p>
              {order.customer_phone && (
                <p className="text-xs text-gray-500">{order.customer_phone}</p>
              )}
              {itemsCount > 0 && (
                <p className="text-xs text-gray-500">Товаров: {itemsCount}</p>
              )}
            </div>
          </div>
          {getStatusBadge(order.status as OrderStatus)}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-xs text-gray-500">
              {format(new Date(order.created_at), "dd.MM.yyyy")}
            </p>
            <p className="font-semibold">{order.total_amount.toLocaleString()} ₸</p>
          </div>
          <div className="flex gap-2">
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

      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-3 items-end">
        {/* Фильтры для моб. устройств: только статус и поиск */}
        {isMobile ? (
          <>
            <div className="w-full">
              <p className="text-sm mb-1">Статус</p>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <p className="text-sm mb-1">Поиск</p>
              <Input
                placeholder="Поиск по ID, имени, телефону"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
                className="w-full"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full md:w-auto">
              <p className="text-sm mb-1">Статус</p>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value || undefined)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <p className="text-sm mb-1">Дата от</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[180px] justify-start text-left font-normal">
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "dd.MM.yyyy")
                    ) : (
                      <span className="text-muted-foreground">Выберите дату</span>
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
            </div>

            <div className="w-full md:w-auto">
              <p className="text-sm mb-1">Дата до</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[180px] justify-start text-left font-normal">
                    {filters.dateTo ? (
                      format(filters.dateTo, "dd.MM.yyyy")
                    ) : (
                      <span className="text-muted-foreground">Выберите дату</span>
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

            <div className="w-full md:w-64">
              <p className="text-sm mb-1">Поиск</p>
              <Input
                placeholder="Поиск по ID, имени, телефону"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
                className="w-full"
              />
            </div>
          </>
        )}

        <div className={isMobile ? "w-full" : ""}>
          <Button
            variant="outline"
            className={isMobile ? "w-full" : ""}
            onClick={() => setFilters({})}
          >
            Сбросить
          </Button>
        </div>
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
                  <TableHead className="hidden md:table-cell">Оплата</TableHead>
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
                    <TableCell className="hidden md:table-cell">{getPaymentStatusBadge(order.payment_status as PaymentStatus)}</TableCell>
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
