
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Trash2,
  User
} from "lucide-react";
import { useProductsApi } from "@/hooks/products/useProductsApi";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { apiClient } from "@/utils/apiClient";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    status: 'new' as OrderStatus,
    payment_status: 'pending' as PaymentStatus,
    delivery_address: '',
    delivery_date: '',
    comment: ''
  });
  
  // Fetch order data when the component mounts or ID changes
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await apiClient.get(`orders/${id}`);
        
        if (response && response.order) {
          setOrder(response.order);
          setFormData({
            status: response.order.status,
            payment_status: response.order.payment_status,
            delivery_address: response.order.delivery_address || '',
            delivery_date: response.order.delivery_date || '',
            comment: response.order.comment || ''
          });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные заказа",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, toast]);
  
  const handleUpdateOrder = async () => {
    if (!order || !id) return;
    
    try {
      await apiClient.patch(`orders/${id}`, formData);
      
      toast({
        title: "Заказ обновлен",
        description: "Изменения успешно сохранены",
      });
      
      // Refresh order data
      const response = await apiClient.get(`orders/${id}`);
      if (response && response.order) {
        setOrder(response.order);
      }
      
      setEditing(false);
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить заказ",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteOrder = async () => {
    if (!order || !id) return;
    
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      try {
        await apiClient.delete(`orders/${id}`);
        
        toast({
          title: "Заказ удален",
        });
        
        navigate("/orders");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить заказ",
          variant: "destructive",
        });
      }
    }
  };
  
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'processing': return 'default';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };
  
  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold">Загрузка заказа...</h2>
        </div>
        
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold">Заказ не найден</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Заказ с ID {id} не найден или был удален</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/orders')}
              >
                Вернуться к списку заказов
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold">
            Заказ #{id.substring(0, 8)}
          </h2>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status === 'new' ? 'Новый' : 
             order.status === 'processing' ? 'В обработке' : 
             order.status === 'completed' ? 'Выполнен' : 'Отменен'}
          </Badge>
          <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>
            {order.payment_status === 'paid' ? 'Оплачен' : 
             order.payment_status === 'pending' ? 'Ожидает оплаты' : 
             order.payment_status === 'refunded' ? 'Возврат средств' : 'Отменен'}
          </Badge>
        </div>
        
        <div className="space-x-2">
          {!editing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditing(true)}
              >
                Редактировать
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteOrder}
              >
                Удалить
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleUpdateOrder}
              >
                Сохранить
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Основная информация */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Основная информация</h3>
            
            {editing ? (
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Дата создания:</span>
                  <span>{format(parseISO(order.created_at), 'dd.MM.yyyy HH:mm')}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Сумма заказа:</span>
                  <span className="font-semibold">{order.total_amount.toLocaleString()} ₸</span>
                </div>
                
                {order.customer_name && (
                  <div className="flex items-start text-sm">
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
                    className="w-full"
                    onClick={() => navigate(`/chats?id=${order.chat_id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Перейти к чату
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Детали доставки */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Детали доставки и комментарий</h3>
            
            {editing ? (
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
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Товары в заказе */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Товары в заказе</h3>
          
          {!order.items || order.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              В этом заказе нет товаров
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right">Кол-во</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {item.product_image && (
                          <img 
                            src={item.product_image}
                            alt={item.product_name} 
                            className="h-10 w-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          {item.product_name || `Товар #${item.product_id}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.price.toLocaleString()} ₸</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{(item.price * item.quantity).toLocaleString()} ₸</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Итого:</TableCell>
                  <TableCell className="text-right font-bold">{order.total_amount.toLocaleString()} ₸</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
