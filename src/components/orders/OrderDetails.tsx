
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";

// Import all the smaller components
import { OrderStatusBadge, PaymentStatusBadge } from "./details/OrderStatusBadges";
import { OrderBasicInfo } from "./details/OrderBasicInfo";
import { OrderDeliveryDetails } from "./details/OrderDeliveryDetails";
import { OrderItemsTable } from "./details/OrderItemsTable";
import { OrderActions } from "./details/OrderActions";
import { OrderDetailsLoadingState } from "./details/LoadingState";
import { OrderNotFoundState } from "./details/NotFoundState";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { getMockOrderById } from "@/data/mockOrders";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getOrderById, updateOrder, deleteOrder } = useOrdersApi();
  
  // Добавляем явный console.log для отладки
  console.log("OrderDetails component rendered with ID:", id);
  
  // Используем хук для получения заказа по ID
  // Также подготовим фолбэк для прямого использования мока, если будут проблемы с хуком
  const { data: order, isLoading } = getOrderById(id || "");
  
  // Запасной вариант: загружаем данные напрямую из моков
  useEffect(() => {
    if (!order && id && !isLoading) {
      console.log("Trying to fetch order directly from mock data:", id);
      const mockOrder = getMockOrderById(id);
      if (mockOrder) {
        console.log("Mock order found:", mockOrder);
      } else {
        console.log("Order not found in mock data");
      }
    }
  }, [order, id, isLoading]);
  
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState<{
    status: OrderStatus;
    payment_status: PaymentStatus;
    delivery_address: string;
    delivery_date: string;
    comment: string;
  }>({
    status: 'new',
    payment_status: 'pending',
    delivery_address: '',
    delivery_date: '',
    comment: ''
  });
  
  // Обновляем formData когда получили данные заказа
  useEffect(() => {
    if (order) {
      console.log("Order data received:", order);
      setFormData({
        status: order.status as OrderStatus,
        payment_status: order.payment_status as PaymentStatus,
        delivery_address: order.delivery_address || '',
        delivery_date: order.delivery_date || '',
        comment: order.comment || ''
      });
    }
  }, [order]);
  
  const handleUpdateOrder = async () => {
    if (!order || !id) return;
    
    updateOrder.mutate(
      { 
        id, 
        data: formData 
      },
      {
        onSuccess: () => {
          setEditing(false);
          toast({
            title: "Заказ обновлен",
            description: "Информация о заказе успешно обновлена"
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Ошибка при обновлении",
            description: error.message
          });
        }
      }
    );
  };
  
  const handleDeleteOrder = async () => {
    if (!order || !id) return;
    
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      deleteOrder.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Заказ удален",
            description: "Заказ успешно удален"
          });
          navigate("/orders");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Ошибка при удалении",
            description: error.message
          });
        }
      });
    }
  };
  
  if (isLoading) {
    console.log("OrderDetails is in loading state");
    return <OrderDetailsLoadingState />;
  }
  
  if (!order) {
    console.log("OrderDetails: Order not found for id:", id);
    return <OrderNotFoundState id={id} />;
  }
  
  console.log("OrderDetails rendering with order data:", order);
  
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h2 className="text-2xl font-semibold">
            Заказ #{id?.substring(0, 8)}
          </h2>
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
        
        <OrderActions 
          editing={editing}
          onEdit={() => setEditing(true)}
          onCancel={() => setEditing(false)}
          onSave={handleUpdateOrder}
          onDelete={handleDeleteOrder}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Основная информация */}
        <OrderBasicInfo 
          order={order} 
          editing={editing} 
          formData={formData} 
          setFormData={setFormData} 
        />
        
        {/* Детали доставки */}
        <OrderDeliveryDetails 
          order={order} 
          editing={editing} 
          formData={formData} 
          setFormData={setFormData} 
        />
      </div>
      
      {/* Товары в заказе */}
      <OrderItemsTable items={order.items || []} totalAmount={order.total_amount} />
    </div>
  );
}
