
import ChatsPage from "./ChatsPage";

export type TabType = "chats" | "products" | "analytics" | "guide" | "chat" | "datasources" | "examples" | "orders";

export default function Index() {
  // Главная страница теперь просто отображает чаты
  // Вся навигация обрабатывается через AppLayout
  return <ChatsPage />;
}
