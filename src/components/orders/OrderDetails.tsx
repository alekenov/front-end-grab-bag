
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/order";
import { apiClient } from "@/utils/apiClient";

// Import all the smaller components
import { OrderStatusBadge, PaymentStatusBadge } from "./details/OrderStatusBadges";
import { OrderBasicInfo } from "./details/OrderBasicInfo";
import { OrderDeliveryDetails } from "./details/OrderDeliveryDetails";
import { OrderItemsTable } from "./details/OrderItemsTable";
import { OrderActions } from "./details/OrderActions";
import { OrderDetailsLoadingState } from "./details/LoadingState";
import { OrderNotFoundState } from "./details/NotFoundState";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    status: 'new' as Order['status'],
    payment_status: 'pending' as Order['payment_status'],
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
  
  if (loading) {
    return <OrderDetailsLoadingState />;
  }
  
  if (!order) {
    return <OrderNotFoundState id={id} />;
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
