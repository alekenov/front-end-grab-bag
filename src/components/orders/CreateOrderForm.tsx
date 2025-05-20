
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/products/useProductsApi";
import { Product } from "@/types/product";
import { OrderStatus, PaymentStatus } from "@/types/order";

// Helper hook to get customer info
const useCustomers = () => {
  // This would typically use apiClient.get to fetch customers from the API
  // For now, we'll just mock this behavior
  return {
    data: [],
    isLoading: false
  };
};

export function CreateOrderForm() {
  const navigate = useNavigate();
  const { createOrder } = useOrdersApi();
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useCustomers();
  
  const [orderData, setOrderData] = useState({
    customer_id: null,
    chat_id: null,
    status: 'new' as OrderStatus,
    payment_status: 'pending' as PaymentStatus,
    delivery_address: '',
    delivery_date: '',
    comment: ''
  });
  
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: Product, quantity: number }>>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    // Calculate total amount whenever selected products change
    const total = selectedProducts.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    setTotalAmount(total);
  }, [selectedProducts]);
  
  const handleAddProduct = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    // Check if product is already added
    const existingIndex = selectedProducts.findIndex(item => item.product.id === selectedProductId);
    
    if (existingIndex !== -1) {
      // Update quantity if product already exists
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex].quantity += quantity;
      setSelectedProducts(updatedProducts);
    } else {
      // Add new product if it doesn't exist
      setSelectedProducts([...selectedProducts, { product, quantity }]);
    }
    
    // Reset selection
    setSelectedProductId(null);
    setQuantity(1);
  };
  
  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(item => item.product.id !== productId));
  };
  
  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0) {
      alert('Добавьте хотя бы один товар в заказ');
      return;
    }
    
    try {
      // First create the order
      const newOrder = await createOrder.mutateAsync({
        ...orderData,
        total_amount: totalAmount
      });
      
      // If successful and we have the new order's ID, add the items
      if (newOrder && newOrder.id) {
        const orderItems = selectedProducts.map(item => ({
          order_id: newOrder.id,
          product_id: item.product.id,
          price: item.product.price,
          quantity: item.quantity
        }));
        
        // Add each item to the order
        for (const item of orderItems) {
          await apiClient.post(`orders/${newOrder.id}/items`, item);
        }
        
        // Navigate to the new order
        navigate(`/orders/${newOrder.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h2 className="text-2xl font-semibold">Новый заказ</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус заказа</label>
                <Select
                  value={orderData.status}
                  onValueChange={(value) => setOrderData({ ...orderData, status: value as OrderStatus })}
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
                  value={orderData.payment_status}
                  onValueChange={(value) => setOrderData({ ...orderData, payment_status: value as PaymentStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус оплаты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="paid">Оплачен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                    <SelectItem value="refunded">Возврат</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Клиент</label>
                <Select
                  value={orderData.customer_id || ""}
                  onValueChange={(value) => setOrderData({ ...orderData, customer_id: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента (необязательно)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без клиента</SelectItem>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name || customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Адрес доставки</label>
                <Input
                  value={orderData.delivery_address}
                  onChange={(e) => setOrderData({ ...orderData, delivery_address: e.target.value })}
                  placeholder="Введите адрес доставки"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата доставки</label>
                <Input
                  type="datetime-local"
                  value={orderData.delivery_date}
                  onChange={(e) => setOrderData({ ...orderData, delivery_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Комментарий</label>
                <Textarea
                  value={orderData.comment}
                  onChange={(e) => setOrderData({ ...orderData, comment: e.target.value })}
                  placeholder="Комментарий к заказу"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-xl font-semibold mt-6">Товары в заказе</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-grow">
              <Select
                value={selectedProductId?.toString() || ""}
                onValueChange={(value) => setSelectedProductId(value ? parseInt(value) : null)}
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
            
            <div className="w-20">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                placeholder="Кол-во"
              />
            </div>
            
            <Button onClick={handleAddProduct} disabled={!selectedProductId}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
          
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Добавьте товары в заказ
            </div>
          ) : (
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
                {selectedProducts.map(({ product, quantity }) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {product.image_url && (
                          <img 
                            src={product.image_url}
                            alt={product.name} 
                            className="h-10 w-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          {product.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{product.price.toLocaleString()} ₸</TableCell>
                    <TableCell className="text-right">{quantity}</TableCell>
                    <TableCell className="text-right">{(product.price * quantity).toLocaleString()} ₸</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Итого:</TableCell>
                  <TableCell className="text-right font-bold">{totalAmount.toLocaleString()} ₸</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={() => navigate('/orders')}>
          Отмена
        </Button>
        <Button onClick={handleCreateOrder} disabled={selectedProducts.length === 0}>
          Создать заказ
        </Button>
      </div>
    </div>
  );
}
