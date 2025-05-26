
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
import { Outlet, useLocation } from "react-router-dom";

// Wrapper component to provide props to AppLayout
const AppLayoutWrapper = () => {
  const location = useLocation();
  const path = location.pathname;
  
  let activePage = "chats";
  let title = "Чаты";
  
  if (path === "/products") {
    activePage = "products";
    title = "Товары";
  } else if (path === "/analytics") {
    activePage = "analytics";
    title = "Аналитика";
  } else if (path === "/guide") {
    activePage = "guide";
    title = "Руководство";
  } else if (path === "/api") {
    activePage = "api";
    title = "API";
  } else if (path === "/orders" || path.startsWith("/orders/")) {
    activePage = "orders";
    title = "Заказы";
  } else if (path === "/" || path === "/chats") {
    activePage = "chats";
    title = "Чаты";
  }

  console.log("Current route path:", path);
  console.log("Active page set to:", activePage);
  
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
        path: "orders/new",
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
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
