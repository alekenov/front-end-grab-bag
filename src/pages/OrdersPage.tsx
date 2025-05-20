
import { useParams } from "react-router-dom";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";

export default function OrdersPage() {
  const { id, action } = useParams<{ id: string, action: string }>();
  
  // Show create form for /orders/new
  if (action === 'new') {
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
