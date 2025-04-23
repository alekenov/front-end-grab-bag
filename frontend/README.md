# WhatsApp AI Dashboard Frontend

Это фронтенд-часть приложения WhatsApp AI Dashboard, которая размещается на Cloudflare Pages.

## Структура проекта

```
frontend/
├── assets/           # Статические ресурсы
│   ├── main.js       # JavaScript код приложения
│   └── styles.css    # CSS стили
├── index.html        # Главная страница приложения
├── 404.html          # Страница ошибки 404
├── _headers          # Конфигурация HTTP-заголовков Cloudflare Pages
└── _routes.json      # Конфигурация маршрутизации Cloudflare Pages
```

## Интеграция с API

Фронтенд взаимодействует с API, расположенным на Cloudflare Worker. API-эндпоинты:

- `/api/chats` - управление чатами
- `/api/messages` - работа с сообщениями
- `/api/training-examples` - работа с обучающими примерами
- `/api/categories` - категории обучающих примеров

## Развертывание

Проект разворачивается на Cloudflare Pages, тогда как API развернуто на Cloudflare Workers. Маршрутизация настроена таким образом, что:

1. Запросы к `/api/*` обрабатываются воркером
2. Все остальные запросы обрабатываются Pages

## Локальное тестирование

Для локального тестирования можно использовать wrangler:

```bash
# Запуск API
wrangler dev

# В отдельном терминале для фронтенда
cd frontend
npx wrangler pages dev .
```
