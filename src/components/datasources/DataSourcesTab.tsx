import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataSourcesTab() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2 md:p-4">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">База знаний</h2>
      
      <Tabs defaultValue="delivery" className="w-full">
        <TabsList className="mb-3 md:mb-4 flex flex-wrap gap-1 md:gap-2">
          <TabsTrigger value="delivery" className="text-sm">Доставка и самовывоз</TabsTrigger>
          <TabsTrigger value="location" className="text-sm">Адрес и время работы</TabsTrigger>
          <TabsTrigger value="assortment" className="text-sm">Ассортимент</TabsTrigger>
          <TabsTrigger value="care" className="text-sm">Уход за цветами</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery" className="space-y-3 md:space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Доставка</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                Доставка осуществляется ежедневно с 9:00 до 21:00. 
                Стоимость доставки по городу - 350 рублей.
                Бесплатная доставка при заказе от 5000 рублей.
                Доставка в день заказа возможна при оформлении до 19:00.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Самовывоз</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                Самовывоз доступен из двух магазинов:
                - ТЦ "Центральный", 1 этаж
                - ТЦ "Радуга", 2 этаж
                Заказ можно забрать в день оформления через 2 часа после подтверждения.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-3 md:space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Адреса магазинов</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                ТЦ "Центральный": ул. Ленина, 45
                ТЦ "Радуга": пр. Мира, 78
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Время работы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                Пн-Пт: 9:00 - 21:00
                Сб-Вс: 10:00 - 20:00
                Без перерывов и выходных
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assortment" className="space-y-3 md:space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Свежие цветы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                В наличии всегда свежие розы, тюльпаны, хризантемы, гвоздики.
                Поставки цветов 3 раза в неделю.
                Все цветы хранятся в специальных холодильных камерах.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Готовые букеты</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
                Авторские букеты от 2000 рублей.
                Тематические композиции к праздникам.
                Букеты в корзинах и шляпных коробках.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="space-y-3 md:space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Уход за срезанными цветами</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-gray-600">
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
