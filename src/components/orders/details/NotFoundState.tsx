
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotFoundStateProps {
  id?: string;
}

export function OrderNotFoundState({ id }: NotFoundStateProps) {
  const navigate = useNavigate();
  
  return (
    <div className="container py-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h2 className="text-2xl font-semibold">Заказ не найден</h2>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Заказ с ID {id} не найден или был удален</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/orders')}
            >
              Вернуться к списку заказов
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
