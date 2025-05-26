
import ChatsPage from "./ChatsPage";

export type TabType = "chats" | "products" | "analytics" | "guide" | "chat" | "datasources" | "examples" | "orders";

export default function Index() {
  // Главная страница показывает чаты только для корневого маршрута
  return <ChatsPage />;
}
