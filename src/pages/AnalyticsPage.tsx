
import { AppLayout } from "@/components/layout/AppLayout";

export default function AnalyticsPage() {
  return (
    <AppLayout title="Аналитика" activePage="analytics">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Аналитика чатов</h1>
        {/* Analytics content will be added here */}
      </div>
    </AppLayout>
  );
}
