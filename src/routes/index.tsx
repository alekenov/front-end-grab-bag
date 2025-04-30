
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ChatsPage from "@/pages/ChatsPage";
import GuidePage from "@/pages/GuidePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ApiPage from "@/pages/ApiPage";

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
  {
    path: "/api",
    element: <ApiPage />,
  },
  {
    // Add redirect for the old knowledge route
    path: "/knowledge",
    element: <Navigate to="/guide" replace />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}
