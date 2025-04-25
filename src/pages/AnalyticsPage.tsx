
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

// Демо-данные для графика чатов
const initialData = [
  { name: "Пн", chats: 4 },
  { name: "Вт", chats: 7 },
  { name: "Ср", chats: 5 },
  { name: "Чт", chats: 8 },
  { name: "Пт", chats: 12 },
  { name: "Сб", chats: 3 },
  { name: "Вс", chats: 2 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<number[]>([7]); // Дней для отображения (за неделю)
  
  return (
    <AppLayout title="Аналитика" activePage="analytics">
      <div className="p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-4">Аналитика чатов</h1>
        
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-medium mb-2">Активность чатов</h2>
          <p className="text-sm text-gray-500 mb-4">Количество чатов за последние {timeRange[0]} дней</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="chats" fill="#1a73e8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6">
            <p className="text-sm mb-2">Выберите период: {timeRange[0]} дней</p>
            <Slider 
              defaultValue={timeRange} 
              max={30} 
              min={1} 
              step={1}
              onValueChange={setTimeRange}
              className="w-full max-w-md"
            />
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Всего чатов</h3>
            <p className="text-3xl font-bold mt-2">124</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Активных чатов</h3>
            <p className="text-3xl font-bold mt-2">32</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Сообщений сегодня</h3>
            <p className="text-3xl font-bold mt-2">78</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
