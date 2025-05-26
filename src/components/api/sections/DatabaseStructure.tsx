
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DatabaseStructure() {
  return (
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
  );
}
