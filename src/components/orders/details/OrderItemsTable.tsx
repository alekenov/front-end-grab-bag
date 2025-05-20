
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { OrderItem } from "@/types/order";

interface OrderItemsTableProps {
  items: OrderItem[];
  totalAmount: number;
}

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Товары в заказе</h3>
          <div className="text-center py-8 text-gray-500">
            В этом заказе нет товаров
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
