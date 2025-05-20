
import { useParams, useLocation } from "react-router-dom";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";

export default function OrdersPage() {
  // Получаем параметры из URL
  const params = useParams();
  const location = useLocation();
  const id = params.id;
  
  // Добавим логирование для отладки
  console.log("OrdersPage rendered with path:", location.pathname);
  console.log("OrdersPage params.id:", id);
  
  // Проверяем точный путь для действия "new"
  const isNewOrder = location.pathname.endsWith("/orders/new");
  
  // Show create form for /orders/new
  if (isNewOrder) {
    console.log("Rendering CreateOrderForm");
    return (
      <div className="container py-6">
        <CreateOrderForm />
      </div>
    );
  }
  
  // Show order details for /orders/:id
  if (id) {
    console.log("Rendering OrderDetails for id:", id);
    return (
      <div className="container py-6">
        <OrderDetails />
      </div>
    );
  }
  
  // Show orders list for /orders
  console.log("Rendering OrdersList");
  return (
    <div className="container py-6">
      <OrdersList />
    </div>
  );
}
