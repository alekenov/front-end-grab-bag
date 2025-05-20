
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, MessageSquare } from "lucide-react";
import { Order } from "@/types/order";

interface OrderDeliveryDetailsProps {
  order: Order;
  editing: boolean;
  formData: {
    delivery_address: string;
    delivery_date: string;
    comment: string;
  };
  setFormData: (data: any) => void;
}

export function OrderDeliveryDetails({ order, editing, formData, setFormData }: OrderDeliveryDetailsProps) {
  if (editing) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Детали доставки и комментарий</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Адрес доставки</label>
              <Input
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                placeholder="Введите адрес доставки"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Дата доставки</label>
              <Input
                type="datetime-local"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Комментарий</label>
              <Textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Комментарий к заказу"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Детали доставки и комментарий</h3>
        
        <div className="space-y-4">
          {order.delivery_address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
              <div>{order.delivery_address}</div>
            </div>
          )}
          
          {order.delivery_date && (
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
              <div>{format(parseISO(order.delivery_date), 'dd.MM.yyyy HH:mm')}</div>
            </div>
          )}
          
          {order.comment && (
            <div className="flex items-start">
              <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
              <div>{order.comment}</div>
            </div>
          )}
          
          {!order.delivery_address && !order.delivery_date && !order.comment && (
            <div className="text-gray-500">Нет дополнительной информации</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
