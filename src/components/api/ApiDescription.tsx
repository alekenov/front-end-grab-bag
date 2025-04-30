
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiDescription() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Документация API</h1>
        <p className="text-lg text-gray-700 mb-2">
          Этот документ описывает API и структуру базы данных, необходимые для функционирования чат-платформы.
        </p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="database">Структура БД</TabsTrigger>
          <TabsTrigger value="endpoints">API Эндпоинты</TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Таблицы базы данных</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">users</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>email</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Email пользователя (уникальный)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>last_login</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата последнего входа</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">customers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Имя клиента</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>phone</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Телефон для связи</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">customer_tags</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>customer_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Ссылка на клиента</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>tag</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Тег клиента</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">chats</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>customer_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Ссылка на клиента</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Название чата</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ai_enabled</TableCell>
                      <TableCell>boolean</TableCell>
                      <TableCell>Флаг включения ИИ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>updated_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата последнего сообщения</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">messages</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>chat_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Ссылка на чат</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>content</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Содержание сообщения</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>role</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Роль (USER/BOT)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>timestamp</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Время отправки</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>is_read</TableCell>
                      <TableCell>boolean</TableCell>
                      <TableCell>Прочитано ли сообщение</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">knowledge_items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>title</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Заголовок</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>content</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Содержание</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Дата создания</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">knowledge_tags</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>knowledge_id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Ссылка на элемент знаний</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>tag</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Тег</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">training_examples</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>category</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Категория</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>query</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Запрос пользователя</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>response</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Ответ бота</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">analytics_events</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Поле</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Первичный ключ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>event_type</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell>Тип события</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>event_data</TableCell>
                      <TableCell>jsonb</TableCell>
                      <TableCell>Данные события</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>occurred_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Время события</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Представления (Views)</h2>
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
              <h2 className="text-2xl font-semibold mb-4">Эндпоинты API</h2>
              <p className="text-gray-600 mb-4">
                Все эндпоинты находятся под базовым URL: <code className="bg-gray-100 px-2 py-1 rounded">/api</code>
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Чаты</h3>
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
                      <TableCell>/chats</TableCell>
                      <TableCell>Получить список чатов</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/chats/{"{id}"}</TableCell>
                      <TableCell>Получить чат по ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/chats</TableCell>
                      <TableCell>Создать новый чат</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PATCH</TableCell>
                      <TableCell>/chats/{"{id}"}</TableCell>
                      <TableCell>Обновить чат</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/chats/{"{id}"}</TableCell>
                      <TableCell>Удалить чат</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PATCH</TableCell>
                      <TableCell>/chats/{"{id}"}/contact</TableCell>
                      <TableCell>Обновить данные контакта (имя и теги)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Сообщения</h3>
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
                      <TableCell>/messages/{"{chatId}"}</TableCell>
                      <TableCell>Получить список сообщений чата</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/messages</TableCell>
                      <TableCell>Отправить новое сообщение</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PATCH</TableCell>
                      <TableCell>/messages/{"{id}"}/read</TableCell>
                      <TableCell>Отметить сообщение как прочитанное</TableCell>
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
