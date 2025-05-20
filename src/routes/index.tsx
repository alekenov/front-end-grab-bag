
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProductsPage from "@/pages/ProductsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import GuidePage from "@/pages/GuidePage";
import ApiPage from "@/pages/ApiPage";
import OrdersPage from "@/pages/OrdersPage";
import ChatsPage from "@/pages/ChatsPage";
import { Outlet } from "react-router-dom";

// Wrapper component to provide props to AppLayout
const AppLayoutWrapper = () => {
  // Determine the active page based on the current path
  const path = window.location.pathname;
  let activePage = "chats";
  let title = "Чаты";
  
  if (path.startsWith("/products")) {
    activePage = "products";
    title = "Товары";
  } else if (path.startsWith("/analytics")) {
    activePage = "analytics";
    title = "Аналитика";
  } else if (path.startsWith("/guide")) {
    activePage = "guide";
    title = "Руководство";
  } else if (path.startsWith("/api")) {
    activePage = "api";
    title = "API";
  } else if (path.startsWith("/orders")) {
    activePage = "orders";
    title = "Заказы";
  } else if (path === "/" || path.startsWith("/chats")) {
    activePage = "chats";
    title = "Чаты";
  }
  
  return (
    <AppLayout title={title} activePage={activePage as any}>
      <Outlet />
    </AppLayout>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayoutWrapper />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "chats",
        element: <ChatsPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrdersPage />,
      },
      {
        path: "orders/:action",
        element: <OrdersPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "api",
        element: <ApiPage />,
      },
      {
        path: "guide",
        element: <GuidePage />,
      },
    ],
  },
]);

export default router;
