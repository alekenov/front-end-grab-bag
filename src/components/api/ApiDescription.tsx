
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrontendRequirements } from "./sections/FrontendRequirements";
import { DatabaseStructure } from "./sections/DatabaseStructure";
import { ApiEndpoints } from "./sections/ApiEndpoints";
import { DataExamples } from "./sections/DataExamples";
import { ImplementationRecommendations } from "./sections/ImplementationRecommendations";

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
          <FrontendRequirements />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseStructure />
        </TabsContent>

        <TabsContent value="endpoints">
          <ApiEndpoints />
        </TabsContent>

        <TabsContent value="data-examples">
          <DataExamples />
        </TabsContent>
      </Tabs>

      <ImplementationRecommendations />
    </div>
  );
}
