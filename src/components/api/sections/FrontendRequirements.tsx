
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FrontendRequirements() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основные требования к данным для фронтенда</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Чаты <Badge variant="destructive" className="ml-2">Критично</Badge>
            </h3>
            <p className="text-gray-600 mb-2">Для корректной работы списка чатов и навигации требуется:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Список всех чатов с базовой информацией (id, название, последнее сообщение)</li>
              <li>Количество непрочитанных сообщений для каждого чата</li>
              <li>Информация о клиенте (имя, телефон, теги)</li>
              <li>Статус AI для каждого чата (включен/выключен)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Сообщения <Badge variant="destructive" className="ml-2">Критично</Badge>
            </h3>
            <p className="text-gray-600 mb-2">Для отображения истории переписки:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Полная история сообщений для выбранного чата</li>
              <li>Роль отправителя (USER/BOT)</li>
              <li>Временные метки сообщений</li>
              <li>Статус прочтения сообщений</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Товары <Badge variant="outline" className="ml-2">Важно</Badge>
            </h3>
            <p className="text-gray-600 mb-2">Для каталога товаров и создания заказов:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Список всех товаров с изображениями, названиями и ценами</li>
              <li>Категории товаров для фильтрации</li>
              <li>Статус наличия товаров</li>
              <li>Возможность поиска по названию и цене</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Заказы <Badge variant="outline" className="ml-2">Важно</Badge>
            </h3>
            <p className="text-gray-600 mb-2">Для управления заказами:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Список всех заказов с основной информацией</li>
              <li>Детали заказа включая товары и количество</li>
              <li>Статусы заказов и оплаты</li>
              <li>Информация о доставке и клиенте</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              База знаний <Badge variant="secondary" className="ml-2">Опционально</Badge>
            </h3>
            <p className="text-gray-600 mb-2">Для обучения AI-ассистента:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Статьи базы знаний с заголовками и содержимым</li>
              <li>Теги для категоризации знаний</li>
              <li>Обучающие примеры запросов и ответов</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Минимальный набор данных для запуска</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Критически важно для работы:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Таблицы:</strong> customers, chats, messages</li>
              <li><strong>API:</strong> GET /chats, GET /messages/[chatId], POST /messages</li>
              <li><strong>Данные:</strong> Хотя бы 1 клиент, 1 чат, несколько тестовых сообщений</li>
            </ol>
            <p className="mt-3 text-sm text-blue-700">
              С этим минимумом фронтенд сможет отображать список чатов и позволит переписываться.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
