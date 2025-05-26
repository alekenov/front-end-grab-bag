import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ApiDescription() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Документация API</h1>
        <p className="text-lg text-gray-700 mb-2">
          Этот документ описывает API, структуру базы данных и требования к данным для функционирования чат-платформы.
        </p>
      </div>

      <Tabs defaultValue="frontend-requirements" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="frontend-requirements">Требования фронтенда</TabsTrigger>
          <TabsTrigger value="database">Структура БД</TabsTrigger>
          <TabsTrigger value="endpoints">API Эндпоинты</TabsTrigger>
          <TabsTrigger value="data-examples">Примеры данных</TabsTrigger>
        </TabsList>

        <TabsContent value="frontend-requirements">
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
        </TabsContent>

        <TabsContent value="database">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Обязательные таблицы</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2 flex items-center">
                  customers <Badge variant="destructive">Критично</Badge>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Обязательное</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell><Badge variant="outline">Нет</Badge></TableCell>
                      <TableCell>Имя клиента</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>phone</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell><Badge variant="outline">Нет</Badge></TableCell>
                      <TableCell>Телефон для связи</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2 flex items-center">
                  chats <Badge variant="destructive">Критично</Badge>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Обязательное</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>customer_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Ссылка на клиента</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell><Badge variant="outline">Нет</Badge></TableCell>
                      <TableCell>Название чата</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ai_enabled</TableCell>
                      <TableCell>boolean</TableCell>
                      <TableCell><Badge variant="outline">Нет</Badge></TableCell>
                      <TableCell>Флаг включения ИИ (по умолчанию false)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updated_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Дата последнего сообщения</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2 flex items-center">
                  messages <Badge variant="destructive">Критично</Badge>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Обязательное</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>chat_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Ссылка на чат</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>content</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Содержание сообщения</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>role</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Роль (USER или BOT)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>timestamp</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell><Badge variant="destructive">Да</Badge></TableCell>
                      <TableCell>Время отправки</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>is_read</TableCell>
                      <TableCell>boolean</TableCell>
                      <TableCell><Badge variant="outline">Нет</Badge></TableCell>
                      <TableCell>Прочитано ли сообщение (по умолчанию false)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Дополнительные таблицы</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      products <Badge variant="outline" className="ml-2">Важно</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Для каталога товаров и создания заказов</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>id, name, price, category</li>
                      <li>image_url, description</li>
                      <li>availability, quantity</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      orders <Badge variant="outline" className="ml-2">Важно</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Для управления заказами</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>id, customer_id, chat_id</li>
                      <li>status, payment_status</li>
                      <li>total_amount, delivery_address</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      knowledge_items <Badge variant="secondary" className="ml-2">Опционально</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Для базы знаний AI</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>id, title, content</li>
                      <li>created_at</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      customer_tags <Badge variant="secondary" className="ml-2">Опционально</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Для тегирования клиентов</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                      <li>customer_id, tag</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Представления (Views)</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">unread_messages_count</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="font-mono text-sm">
                      CREATE VIEW unread_messages_count AS<br />
                      SELECT chat_id, COUNT(*) as count<br />
                      FROM messages<br />
                      WHERE is_read = false AND role = 'USER'<br />
                      GROUP BY chat_id;
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">latest_messages</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="font-mono text-sm">
                      CREATE VIEW latest_messages AS<br />
                      SELECT DISTINCT ON (chat_id) *<br />
                      FROM messages<br />
                      ORDER BY chat_id, timestamp DESC;
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">daily_analytics</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="font-mono text-sm">
                      CREATE VIEW daily_analytics AS<br />
                      SELECT<br />
                      &nbsp;&nbsp;DATE_TRUNC('day', occurred_at) as day,<br />
                      &nbsp;&nbsp;event_type,<br />
                      &nbsp;&nbsp;COUNT(*) as event_count<br />
                      FROM analytics_events<br />
                      GROUP BY 1, 2<br />
                      ORDER BY 1 DESC, 2;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Функции и триггеры</h2>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2">update_chat_timestamp</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-mono text-sm">
                    CREATE OR REPLACE FUNCTION update_chat_timestamp()<br />
                    RETURNS TRIGGER AS $$<br />
                    BEGIN<br />
                    &nbsp;&nbsp;UPDATE chats<br />
                    &nbsp;&nbsp;SET updated_at = NOW()<br />
                    &nbsp;&nbsp;WHERE id = NEW.chat_id;<br />
                    &nbsp;&nbsp;RETURN NEW;<br />
                    END;<br />
                    $$ LANGUAGE plpgsql;

                    <br /><br />

                    CREATE TRIGGER message_update_chat_timestamp<br />
                    AFTER INSERT ON messages<br />
                    FOR EACH ROW<br />
                    EXECUTE FUNCTION update_chat_timestamp();
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="endpoints">
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
        </TabsContent>

        <TabsContent value="data-examples">
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
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Рекомендации по внедрению</h2>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="text-xl font-medium text-blue-800 mb-2">Этапы внедрения</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Создать Issue с меткой DB Changes для создания необходимых таблиц и связей</li>
            <li>Реализовать API эндпоинты на бэкенде согласно документации</li>
            <li>Обновить фронтенд для подключения к новым эндпоинтам</li>
            <li>Настроить авторизацию и права доступа</li>
            <li>Протестировать работу системы с реальными данными</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
