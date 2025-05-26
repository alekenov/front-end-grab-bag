
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MessageSquare, CalendarClock, UserCheck, Clock } from "lucide-react";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { useNavigate } from "react-router-dom";

interface OrderBasicInfoProps {
  order: Order;
  editing: boolean;
  formData: {
    status: OrderStatus;
    payment_status: PaymentStatus;
    responsible_manager?: string;
    estimated_delivery_time?: string;
  };
  setFormData: (data: any) => void;
}

export function OrderBasicInfo({ order, editing, formData, setFormData }: OrderBasicInfoProps) {
  const navigate = useNavigate();
  
  // Тестовый массив менеджеров для выбора
  const managers = [
    "Алексей Смирнов", 
    "Елена Петрова", 
    "Дмитрий Иванов", 
    "Анна Козлова", 
    "Сергей Соколов"
  ];
  
  if (editing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Основная информация</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Статус заказа</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as OrderStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Выполнен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Статус оплаты</label>
              <Select
                value={formData.payment_status}
                onValueChange={(value) => setFormData({ ...formData, payment_status: value as PaymentStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает оплаты</SelectItem>
                  <SelectItem value="paid">Оплачен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                  <SelectItem value="refunded">Возврат средств</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Добавляем поле для ответственного менеджера */}
            {(formData.status === "processing" || formData.status === "completed") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Ответственный менеджер</label>
                <Select
                  value={formData.responsible_manager || "unassigned"}
                  onValueChange={(value) => setFormData({ ...formData, responsible_manager: value === "unassigned" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Не назначен</SelectItem>
                    {managers.map(manager => (
                      <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Добавляем поле для времени доставки */}
            {formData.status === "processing" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Примерное время доставки</label>
                <Input
                  value={formData.estimated_delivery_time || ""}
                  onChange={(e) => setFormData({ ...formData, estimated_delivery_time: e.target.value })}
                  placeholder="Например: 30 минут"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-4 md:pt-6">
        <h3 className="font-medium mb-3 md:mb-4">Основная информация</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-500">Дата:</span>
            </div>
            <span>{format(parseISO(order.created_at), 'dd.MM.yyyy HH:mm')}</span>
          </div>
          
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500">Сумма заказа:</span>
            <span className="font-semibold">{order.total_amount.toLocaleString()} ₸</span>
          </div>
          
          {/* Показываем ответственного менеджера */}
          {order.responsible_manager && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Ответственный:</span>
              </div>
              <span>{order.responsible_manager}</span>
            </div>
          )}
          
          {/* Показываем примерное время доставки */}
          {order.status === "processing" && order.estimated_delivery_time && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-500">Время доставки:</span>
              </div>
              <span>{order.estimated_delivery_time}</span>
            </div>
          )}
          
          {order.customer_name && (
            <div className="flex items-start text-sm pt-1">
              <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
              <div>
                <div>{order.customer_name}</div>
                {order.customer_phone && <div className="text-gray-500">{order.customer_phone}</div>}
              </div>
            </div>
          )}
          
          {order.chat_id && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate(`/chats?id=${order.chat_id}`)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Перейти к чату
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
