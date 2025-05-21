
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrdersPage() {
  // Получаем параметры из URL и хук для навигации
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = params.id;
  const isMobile = useIsMobile();
  
  // Более детальное логирование для отладки
  console.log("OrdersPage rendered with path:", location.pathname);
  console.log("OrdersPage params:", params);
  console.log("OrdersPage id param:", id);
  console.log("Is mobile view:", isMobile);
  
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
      <ScrollArea className={`container ${isMobile ? 'h-[calc(100vh-80px)] px-2 py-3' : 'h-[calc(100vh-80px)] py-6'}`}>
        <CreateOrderForm />
      </ScrollArea>
    );
  }
  
  // Show order details for /orders/:id
  if (id) {
    console.log("Rendering OrderDetails for id:", id);
    return (
      <ScrollArea className={`container ${isMobile ? 'h-[calc(100vh-80px)] px-2 py-3' : 'h-[calc(100vh-80px)] py-6'}`}>
        <OrderDetails />
      </ScrollArea>
    );
  }
  
  // Show orders list for /orders
  console.log("Rendering OrdersList at /orders");
  return (
    <div className={`container ${isMobile ? 'px-2 py-3' : 'py-6'}`}>
      <OrdersList />
    </div>
  );
}
