
import { useState } from "react";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
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

export function OrdersList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<OrdersFilter>({});
  const { getOrders } = useOrdersApi();
  const { data: orders = [], isLoading, refetch } = getOrders(filters);

  const handleFilterChange = (key: keyof OrdersFilter, value: any) => {
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
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Заказы</h2>
        <Button onClick={() => navigate("/orders/new")}>Новый заказ</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-3 items-end">
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
              <SelectItem value="">Все статусы</SelectItem>
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

        <div>
          <Button
            variant="outline"
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Оплата</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50" onClick={() => viewOrderDetails(order.id)}>
                  <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      {order.customer_name || 'Неизвестный клиент'}
                      {order.customer_phone && <div className="text-xs text-gray-500">{order.customer_phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{order.total_amount.toLocaleString()} ₸</TableCell>
                  <TableCell>{getStatusBadge(order.status as OrderStatus)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.payment_status as PaymentStatus)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewOrderDetails(order.id);
                      }}
                    >
                      Детали
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
