
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { delivery, mapPin, clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataSourcesTab() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4">
      <h2 className="text-xl font-semibold mb-4">База знаний</h2>
      
      <Tabs defaultValue="delivery" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="delivery">Доставка и самовывоз</TabsTrigger>
          <TabsTrigger value="location">Адрес и время работы</TabsTrigger>
          <TabsTrigger value="assortment">Ассортимент</TabsTrigger>
          <TabsTrigger value="care">Уход за цветами</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Доставка</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Доставка осуществляется ежедневно с 9:00 до 21:00. 
                Стоимость доставки по городу - 350 рублей.
                Бесплатная доставка при заказе от 5000 рублей.
                Доставка в день заказа возможна при оформлении до 19:00.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Самовывоз</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Самовывоз доступен из двух магазинов:
                - ТЦ "Центральный", 1 этаж
                - ТЦ "Радуга", 2 этаж
                Заказ можно забрать в день оформления через 2 часа после подтверждения.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Адреса магазинов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                ТЦ "Центральный": ул. Ленина, 45
                ТЦ "Радуга": пр. Мира, 78
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Время работы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Пн-Пт: 9:00 - 21:00
                Сб-Вс: 10:00 - 20:00
                Без перерывов и выходных
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assortment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Свежие цветы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                В наличии всегда свежие розы, тюльпаны, хризантемы, гвоздики.
                Поставки цветов 3 раза в неделю.
                Все цветы хранятся в специальных холодильных камерах.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Готовые букеты</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Авторские букеты от 2000 рублей.
                Тематические композиции к праздникам.
                Букеты в корзинах и шляпных коробках.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Уход за срезанными цветами</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                1. Менять воду каждые 2 дня
                2. Обрезать стебли под углом 45 градусов
                3. Хранить букет вдали от прямых солнечных лучей
                4. Оптимальная температура 18-20 градусов
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
