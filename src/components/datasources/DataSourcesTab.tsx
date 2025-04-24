
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataSourcesTab() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2 md:p-4">
      <h2 className="text-lg font-semibold mb-3">База знаний</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {['Доставка', 'Самовывоз', 'Адреса', 'Время работы', 'Ассортимент', 'Уход'].map((tag) => (
          <Badge 
            key={tag}
            variant="outline" 
            className="px-3 py-1 text-xs cursor-pointer hover:bg-primary/10 transition-colors"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Доставка</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-gray-600">
            <p>Доставка ежедневно 9:00-21:00. По городу - 350₽. Бесплатно от 5000₽. Заказ в тот же день при оформлении до 19:00.</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Самовывоз</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-gray-600">
            <p>Доступен из двух магазинов: ТЦ "Центральный" (1 этаж), ТЦ "Радуга" (2 этаж). Готовность через 2 часа.</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Адреса магазинов</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-gray-600">
            <p>ТЦ "Центральный": ул. Ленина, 45<br />ТЦ "Радуга": пр. Мира, 78</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">График работы</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-gray-600">
            <p>Пн-Пт: 9:00 - 21:00<br />Сб-Вс: 10:00 - 20:00<br />Без перерывов и выходных</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
