
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Trash2, ArrowLeft, Edit, Plus, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/products/useProductsApi";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrder, deleteOrder, addOrderItem, removeOrderItem } = useOrdersApi();
  const { data: order, isLoading, refetch } = getOrderById(id || null);
  const { data: products = [] } = useProducts();
  
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState<{
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    delivery_address?: string;
    delivery_date?: string;
    comment?: string;
  }>({});
  const [newItem, setNewItem] = useState<{
    product_id?: number;
    quantity: number;
  }>({
    quantity: 1
  });

  const handleOrderUpdate = async () => {
    if (!id) return;
    
    try {
      await updateOrder.mutateAsync({
        id,
        data: updatedOrder
      });
      
      setIsUpdateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Ошибка обновления заказа:", error);
    }
  };

  const handleOrderDelete = async () => {
    if (!id) return;
    
    try {
      await deleteOrder.mutateAsync(id);
      navigate('/orders');
    } catch (error) {
      console.error("Ошибка удаления заказа:", error);
    }
  };

  const handleAddItem = async () => {
    if (!id || !newItem.product_id) return;
    
    try {
      await addOrderItem.mutateAsync({
        orderId: id,
        item: newItem
      });
      
      setIsAddItemDialogOpen(false);
      setNewItem({ quantity: 1 });
      refetch();
    } catch (error) {
      console.error("Ошибка добавления товара:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!id) return;
    
    try {
      await removeOrderItem.mutateAsync({
        orderId: id,
        itemId
      });
      
      refetch();
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
    }
  };

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

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Ожидает</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Оплачен</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Отменен</Badge>;
      case 'refunded':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Возврат</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Загрузка данных заказа...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4">Заказ не найден</p>
        <Button onClick={() => navigate('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к списку заказов
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold">Заказ #{order.id.substring(0, 8)}</h2>
          {getStatusBadge(order.status as OrderStatus)}
        </div>

        <div className="flex gap-2">
          {order.chat_id && (
            <Button variant="outline" onClick={() => navigate(`/?chatId=${order.chat_id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Перейти в чат
            </Button>
          )}
          
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Изменить
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Редактирование заказа</DialogTitle>
                <DialogDescription>
                  Измените данные заказа и нажмите "Сохранить" для подтверждения изменений.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Статус заказа</label>
                    <Select
                      value={updatedOrder.status || order.status}
                      onValueChange={(value) => setUpdatedOrder(prev => ({ ...prev, status: value as OrderStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
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
                      value={updatedOrder.payment_status || order.payment_status}
                      onValueChange={(value) => setUpdatedOrder(prev => ({ ...prev, payment_status: value as PaymentStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="paid">Оплачен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                        <SelectItem value="refunded">Возврат</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Адрес доставки</label>
                  <Input
                    value={updatedOrder.delivery_address !== undefined ? updatedOrder.delivery_address : (order.delivery_address || '')}
                    onChange={(e) => setUpdatedOrder(prev => ({ ...prev, delivery_address: e.target.value }))}
                    placeholder="Введите адрес доставки"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата доставки</label>
                  <Input
                    type="datetime-local"
                    value={updatedOrder.delivery_date !== undefined ? updatedOrder.delivery_date : (order.delivery_date || '')}
                    onChange={(e) => setUpdatedOrder(prev => ({ ...prev, delivery_date: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Комментарий</label>
                  <Textarea
                    value={updatedOrder.comment !== undefined ? updatedOrder.comment : (order.comment || '')}
                    onChange={(e) => setUpdatedOrder(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Комментарий к заказу"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Отмена</Button>
                <Button onClick={handleOrderUpdate}>Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Заказ будет удален из системы.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleOrderDelete}>Удалить</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID заказа</dt>
                <dd className="font-mono">{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Дата создания</dt>
                <dd>{format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Последнее обновление</dt>
                <dd>{format(new Date(order.updated_at), "dd.MM.yyyy HH:mm")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Статус заказа</dt>
                <dd>{getStatusBadge(order.status as OrderStatus)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Статус оплаты</dt>
                <dd>{getPaymentStatusBadge(order.payment_status as PaymentStatus)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Сумма заказа</dt>
                <dd className="text-lg font-semibold">{order.total_amount.toLocaleString()} ₸</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Информация о клиенте</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Имя клиента</dt>
                <dd>{order.customer_name || 'Не указано'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                <dd>{order.customer_phone || 'Не указан'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Информация о доставке</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Адрес доставки</dt>
                <dd>{order.delivery_address || 'Не указан'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Дата доставки</dt>
                <dd>
                  {order.delivery_date 
                    ? format(new Date(order.delivery_date), "dd.MM.yyyy HH:mm") 
                    : 'Не указана'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Комментарий</dt>
                <dd className="whitespace-pre-wrap">{order.comment || 'Нет комментария'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Товары в заказе</h3>
          
          <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Добавление товара</DialogTitle>
                <DialogDescription>
                  Выберите товар и укажите количество для добавления в заказ.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Товар</label>
                  <Select
                    value={newItem.product_id?.toString() || ""}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, product_id: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите товар" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.price.toLocaleString()} ₸)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Количество</label>
                  <Input
                    type="number"
                    min={1}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>Отмена</Button>
                <Button onClick={handleAddItem} disabled={!newItem.product_id}>Добавить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!order.items || order.items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-2">В заказе нет товаров</p>
            <p className="text-sm text-gray-400">
              Нажмите на кнопку «Добавить товар» чтобы добавить товары в заказ
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right">Кол-во</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="text-right w-[70px]"></TableHead>
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
                            alt={item.product_name || 'Товар'} 
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Итого:</TableCell>
                  <TableCell className="text-right font-bold">{order.total_amount.toLocaleString()} ₸</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
