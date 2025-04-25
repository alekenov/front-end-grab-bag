
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatsPage from "@/pages/ChatsPage";
import KnowledgePage from "@/pages/KnowledgePage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ChatsPage />,
  },
  {
    path: "/knowledge",
    element: <KnowledgePage />,
  },
]);

export function Routes() {
  return <RouterProvider router={routes} />;
}
