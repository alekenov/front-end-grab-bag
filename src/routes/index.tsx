
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatsPage from "@/pages/ChatsPage";
import GuidePage from "@/pages/GuidePage";
import AnalyticsPage from "@/pages/AnalyticsPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ChatsPage />,
  },
  {
    path: "/guide",
    element: <GuidePage />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}
