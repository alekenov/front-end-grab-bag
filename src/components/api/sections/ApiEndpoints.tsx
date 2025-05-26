
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ApiEndpoints() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Критически важные эндпоинты</h2>
        <p className="text-gray-600 mb-4">
          Эти эндпоинты необходимы для базовой работы фронтенда
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 flex items-center">
            Чаты <Badge variant="destructive" className="ml-2">Критично</Badge>
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/chats</TableCell>
                <TableCell><Badge variant="destructive">Критично</Badge></TableCell>
                <TableCell>Список чатов с количеством непрочитанных</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/chats/{"{id}"}</TableCell>
                <TableCell><Badge variant="destructive">Критично</Badge></TableCell>
                <TableCell>Детали чата и информация о клиенте</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PATCH</TableCell>
                <TableCell>/chats/{"{id}"}/ai</TableCell>
                <TableCell><Badge variant="outline">Важно</Badge></TableCell>
                <TableCell>Включение/выключение AI для чата</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 flex items-center">
            Сообщения <Badge variant="destructive" className="ml-2">Критично</Badge>
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/messages/{"{chatId}"}</TableCell>
                <TableCell><Badge variant="destructive">Критично</Badge></TableCell>
                <TableCell>История сообщений чата</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>POST</TableCell>
                <TableCell>/messages</TableCell>
                <TableCell><Badge variant="destructive">Критично</Badge></TableCell>
                <TableCell>Отправка нового сообщения</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PATCH</TableCell>
                <TableCell>/messages/read</TableCell>
                <TableCell><Badge variant="outline">Важно</Badge></TableCell>
                <TableCell>Отметка сообщений как прочитанных</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">База знаний</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/knowledge</TableCell>
                <TableCell>Получить все элементы базы знаний</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/knowledge/{"{id}"}</TableCell>
                <TableCell>Получить элемент базы знаний по ID</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>POST</TableCell>
                <TableCell>/knowledge</TableCell>
                <TableCell>Создать новый элемент базы знаний</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PUT</TableCell>
                <TableCell>/knowledge/{"{id}"}</TableCell>
                <TableCell>Обновить элемент базы знаний</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>DELETE</TableCell>
                <TableCell>/knowledge/{"{id}"}</TableCell>
                <TableCell>Удалить элемент базы знаний</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">Обучающие примеры</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/examples</TableCell>
                <TableCell>Получить список обучающих примеров</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/examples/{"{id}"}</TableCell>
                <TableCell>Получить пример по ID</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>POST</TableCell>
                <TableCell>/examples</TableCell>
                <TableCell>Создать новый пример</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PUT</TableCell>
                <TableCell>/examples/{"{id}"}</TableCell>
                <TableCell>Обновить пример</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>DELETE</TableCell>
                <TableCell>/examples/{"{id}"}</TableCell>
                <TableCell>Удалить пример</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Аналитика</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/analytics/messages</TableCell>
                <TableCell>Статистика по сообщениям</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/analytics/chats</TableCell>
                <TableCell>Статистика по чатам</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GET</TableCell>
                <TableCell>/analytics/events</TableCell>
                <TableCell>Статистика по событиям</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>POST</TableCell>
                <TableCell>/analytics/events</TableCell>
                <TableCell>Записать новое событие</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Примеры запросов и ответов</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">POST /api/messages</h3>
          <div className="bg-gray-100 p-4 rounded-md mb-2">
            <p className="font-bold mb-1">Запрос:</p>
            <p className="font-mono text-sm">
            &#123;<br />
            &nbsp;&nbsp;"chatId": "1",<br />
            &nbsp;&nbsp;"content": "Здравствуйте! Когда будет доставка?",<br />
            &nbsp;&nbsp;"aiEnabled": true<br />
            &#125;
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-bold mb-1">Ответ:</p>
            <p className="font-mono text-sm">
            &#123;<br />
            &nbsp;&nbsp;"id": "msg-123",<br />
            &nbsp;&nbsp;"chatId": "1",<br />
            &nbsp;&nbsp;"content": "Здравствуйте! Когда будет доставка?",<br />
            &nbsp;&nbsp;"role": "USER",<br />
            &nbsp;&nbsp;"timestamp": "2023-09-15T14:23:45Z",<br />
            &nbsp;&nbsp;"is_read": false<br />
            &#125;
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">PATCH /api/chats/1/contact</h3>
          <div className="bg-gray-100 p-4 rounded-md mb-2">
            <p className="font-bold mb-1">Запрос:</p>
            <p className="font-mono text-sm">
            &#123;<br />
            &nbsp;&nbsp;"name": "Иван Петров",<br />
            &nbsp;&nbsp;"tags": ["пионы", "самовывоз"]<br />
            &#125;
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-bold mb-1">Ответ:</p>
            <p className="font-mono text-sm">
            &#123;<br />
            &nbsp;&nbsp;"success": true,<br />
            &nbsp;&nbsp;"customer": &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"id": "cust-123",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"name": "Иван Петров",<br />
            &nbsp;&nbsp;&nbsp;&nbsp;"tags": ["пионы", "самовывоз"]<br />
            &nbsp;&nbsp;&#125;<br />
            &#125;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
