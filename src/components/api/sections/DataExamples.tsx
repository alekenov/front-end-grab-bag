
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataExamples() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Примеры структур данных</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">GET /chats - Ответ</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
{`{
  "chats": [
    {
      "id": "chat-1",
      "customer_id": "customer-1",
      "customer_name": "Анна Иванова",
      "customer_phone": "+7 900 123-45-67",
      "name": "Заказ букета роз",
      "ai_enabled": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z",
      "last_message": {
        "content": "Спасибо за заказ!",
        "timestamp": "2024-01-15T14:30:00Z",
        "role": "BOT"
      },
      "unread_count": 2,
      "tags": ["постоянный клиент", "розы"]
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">GET /messages/[chatId] - Ответ</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
{`{
  "messages": [
    {
      "id": "msg-1",
      "chat_id": "chat-1",
      "content": "Здравствуйте! Хочу заказать букет роз",
      "role": "USER",
      "timestamp": "2024-01-15T10:00:00Z",
      "is_read": true
    },
    {
      "id": "msg-2",
      "chat_id": "chat-1",
      "content": "Добро пожаловать! Какие розы вас интересуют?",
      "role": "BOT",
      "timestamp": "2024-01-15T10:01:00Z",
      "is_read": true
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">POST /messages - Запрос</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
{`{
  "chat_id": "chat-1",
  "content": "Красные розы, 25 штук",
  "ai_enabled": true
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Минимальные тестовые данные</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Для первого запуска создайте:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1 клиент:</strong>
                <code className="block mt-1 bg-white p-2 rounded">
                  &#123; "name": "Тестовый клиент", "phone": "+7 900 000-00-00" &#125;
                </code>
              </div>
              <div>
                <strong>1 чат:</strong>
                <code className="block mt-1 bg-white p-2 rounded">
                  &#123; "customer_id": "[id клиента]", "name": "Тестовый чат", "ai_enabled": false &#125;
                </code>
              </div>
              <div>
                <strong>2-3 сообщения:</strong>
                <code className="block mt-1 bg-white p-2 rounded">
                  &#123; "chat_id": "[id чата]", "content": "Привет!", "role": "USER" &#125;<br/>
                  &#123; "chat_id": "[id чата]", "content": "Здравствуйте!", "role": "BOT" &#125;
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
