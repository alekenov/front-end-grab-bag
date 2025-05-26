
import React from "react";

export function ImplementationRecommendations() {
  return (
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
  );
}
