
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";
import { useEffect } from "react";

export default function OrdersPage() {
  // Получаем параметры из URL и хук для навигации
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = params.id;
  
  // Более детальное логирование для отладки
  console.log("OrdersPage rendered with path:", location.pathname);
  console.log("OrdersPage params:", params);
  console.log("OrdersPage id param:", id);
  
  // Проверяем точный путь для действия "new"
  const isNewOrder = location.pathname === "/orders/new";
  
  // Эффект для логирования жизненного цикла компонента
  useEffect(() => {
    console.log("OrdersPage mounted with path:", location.pathname);
    return () => {
      console.log("OrdersPage unmounted from path:", location.pathname);
    };
  }, [location.pathname]);
  
  // Show create form for /orders/new
  if (isNewOrder) {
    console.log("Rendering CreateOrderForm at /orders/new");
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
  console.log("Rendering OrdersList at /orders");
  return (
    <div className="container py-6">
      <OrdersList />
    </div>
  );
}
