
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { OrderItem } from "@/types/order";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
}

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
  const isMobile = useIsMobile();
  
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <h3 className="font-medium mb-3 md:mb-4">Товары в заказе</h3>
          <div className="text-center py-6 text-gray-500">
            В этом заказе нет товаров
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Мобильная версия списка товаров в виде карточек
  if (isMobile) {
    return (
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-medium mb-3">Товары в заказе ({items.length})</h3>
          
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex border-b pb-3">
                <div className="flex-shrink-0 mr-3">
                  {item.product_image ? (
                    <img 
                      src={item.product_image}
                      alt={item.product_name} 
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      Нет фото
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">
                    {item.product_name || `Товар #${item.product_id}`}
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>{item.price.toLocaleString()} ₸ × {item.quantity} шт.</span>
                    <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Итого:</span>
              <span className="font-semibold text-lg">{totalAmount.toLocaleString()} ₸</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Десктопная версия в виде таблицы
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Товары в заказе</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Товар</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-right">Кол-во</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center">
                    {item.product_image && (
                      <img 
                        src={item.product_image}
                        alt={item.product_name} 
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
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">Итого:</TableCell>
              <TableCell className="text-right font-bold">{totalAmount.toLocaleString()} ₸</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
