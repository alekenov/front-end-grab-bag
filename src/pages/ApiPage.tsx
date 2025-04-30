
import { AppLayout } from "@/components/layout/AppLayout";
import { ApiDescription } from "@/components/api/ApiDescription";

export default function ApiPage() {
  return (
    <AppLayout title="API Документация" activePage="guide">
      <div className="h-full overflow-y-auto">
        <ApiDescription />
      </div>
    </AppLayout>
  );
}
