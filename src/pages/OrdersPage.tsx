
import { useParams } from "react-router-dom";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";

export default function OrdersPage() {
  // Получаем параметры из URL
  const params = useParams();
  const id = params.id;
  
  // Проверяем точный путь для действия "new"
  const isNewOrder = window.location.pathname.endsWith("/orders/new");
  
  // Show create form for /orders/new
  if (isNewOrder) {
    return (
      <div className="container py-6">
        <CreateOrderForm />
      </div>
    );
  }
  
  // Show order details for /orders/:id
  if (id) {
    return (
      <div className="container py-6">
        <OrderDetails />
      </div>
    );
  }
  
  // Show orders list for /orders
  return (
    <div className="container py-6">
      <OrdersList />
    </div>
  );
}
