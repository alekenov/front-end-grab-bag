
import { useRef } from "react";
import { MessageList } from "./MessageList";
import { ChatOrders } from "./ChatOrders";
import { CreateOrderFromChat } from "./CreateOrderFromChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Message } from "@/types/chat";
import { Product } from "@/types/product";

interface ChatTabsProps {
  tabs: string;
  setTabs: (value: string) => void;
  messages: Message[];
  messagesLoading: boolean;
  isDemoChat: boolean;
  normalizedChatId: string;
  products: Product[];
  onOrderCreated: () => void;
}

export function ChatTabs({
  tabs,
  setTabs,
  messages,
  messagesLoading,
  isDemoChat,
  normalizedChatId,
  products,
  onOrderCreated,
}: ChatTabsProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  return (
    <Tabs value={tabs} onValueChange={setTabs} className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b px-4">
        <TabsList className="h-10">
          <TabsTrigger value="messages" className="data-[state=active]:bg-transparent">Сообщения</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-transparent">Заказы</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="messages" className="flex-1 overflow-y-auto bg-[#f5f7fb] p-0 m-0">
        <div className="px-4 py-6">
          <MessageList 
            messages={messages} 
            isLoading={messagesLoading && !isDemoChat} 
          />
          <div ref={messageEndRef} className="h-8" />
        </div>
      </TabsContent>
      
      <TabsContent value="orders" className="flex-1 overflow-y-auto bg-[#f5f7fb] p-0 m-0">
        <div className="p-4 flex justify-end">
          {!isDemoChat && (
            <CreateOrderFromChat 
              chatId={normalizedChatId} 
              products={products}
              onOrderCreated={onOrderCreated}
            />
          )}
        </div>
        <ChatOrders chatId={normalizedChatId} />
      </TabsContent>
    </Tabs>
  );
}
