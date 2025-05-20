
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { useOrdersApi } from "@/hooks/orders/useOrdersApi";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/apiClient";

interface CreateOrderFromChatProps {
  chatId: string;
  products: Product[];
  onOrderCreated?: () => void;
}

export function CreateOrderFromChat({ chatId, products, onOrderCreated }: CreateOrderFromChatProps) {
  const { toast } = useToast();
  const { createOrder } = useOrdersApi();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]);
  const [comment, setComment] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  const totalAmount = selectedProducts.reduce(
    (total, item) => total + item.product.price * item.quantity, 0
  );
  
  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.some(item => item.product.id === product.id);
      
      if (exists) {
        return prev.filter(item => item.product.id !== product.id);
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };
  
  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProducts(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
          : item
      )
    );
  };

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один товар в заказ",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create order
      const order = await createOrder.mutateAsync({
        chat_id: chatId,
        status: 'new',
        payment_status: 'pending',
        total_amount: totalAmount,
        delivery_address: deliveryAddress || null,
        comment: comment || null
      });
      
      if (!order || !order.id) throw new Error("Не удалось создать заказ");
      
      // Add items to the order
      for (const item of selectedProducts) {
        await apiClient.post(`orders/${order.id}/items`, {
          product_id: Number(item.product.id),
          quantity: item.quantity,
          price: item.product.price
        });
      }
      
      // Success
      toast({
        title: "Заказ создан",
        description: `Заказ #${order.id.substring(0, 8)} успешно создан`,
      });
      
      // Reset form
      setSelectedProducts([]);
      setComment("");
      setDeliveryAddress("");
      setIsOpen(false);
      
      // Callback
      if (onOrderCreated) onOrderCreated();
      
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заказ",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Создать заказ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создание заказа из чата</DialogTitle>
          <DialogDescription>
            Выберите товары для добавления в заказ и укажите детали доставки.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Выберите товары</h3>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {products.map(product => {
                const isSelected = selectedProducts.some(item => item.product.id === product.id);
                const selectedItem = selectedProducts.find(item => item.product.id === product.id);
                
                return (
                  <div 
                    key={product.id} 
                    className={`p-2 border rounded-md cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded mr-2"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.price.toLocaleString()} ₸</div>
                        </div>
                      </div>
                      
                      {!isSelected ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleProduct(product)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex items-center">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2">{selectedItem?.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="ml-2"
                            onClick={() => toggleProduct(product)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="pt-2">
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-medium">Итого:</span>
              <span className="font-semibold">{totalAmount.toLocaleString()} ₸</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Адрес доставки</h3>
            <Input
              placeholder="Введите адрес доставки"
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Комментарий</h3>
            <Textarea
              placeholder="Введите комментарий к заказу"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
          <Button 
            type="button" 
            onClick={handleCreateOrder}
            disabled={selectedProducts.length === 0}
          >
            Создать заказ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
