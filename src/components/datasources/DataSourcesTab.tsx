
import { Badge } from "@/components/ui/badge";
import { KnowledgeCard } from "./KnowledgeCard";

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
        <KnowledgeCard
          title="Доставка"
          content="Доставка ежедневно 9:00-21:00. По городу - 350₽. Бесплатно от 5000₽. Заказ в тот же день при оформлении до 19:00."
        />
        
        <KnowledgeCard
          title="Самовывоз"
          content="Доступен из двух магазинов: ТЦ 'Центральный' (1 этаж), ТЦ 'Радуга' (2 этаж). Готовность через 2 часа."
        />
        
        <KnowledgeCard
          title="Адреса магазинов"
          content="ТЦ 'Центральный': ул. Ленина, 45\nТЦ 'Радуга': пр. Мира, 78"
        />
        
        <KnowledgeCard
          title="График работы"
          content="Пн-Пт: 9:00 - 21:00\nСб-Вс: 10:00 - 20:00\nБез перерывов и выходных"
        />
      </div>
    </div>
  );
}
