const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// Настройка прокси для API (перенаправление запросов на Cloudflare Worker)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8788',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // сохраняем путь /api при перенаправлении
  },
  logLevel: 'debug'
}));

// Обслуживание статических файлов из текущей директории
app.use(express.static(path.join(__dirname)));

// Для всех остальных маршрутов возвращаем index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Локальный сервер запущен на http://localhost:${PORT}`);
  console.log(`API запросы перенаправляются на http://localhost:8788`);
});
