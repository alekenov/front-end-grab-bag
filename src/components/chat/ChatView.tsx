
import { useChatDetails } from "./hooks/useChatDetails";
import { useChatMessages } from "./hooks/useChatMessages";
import { useContactDetails } from "./hooks/useContactDetails";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Product } from "@/types/product";

interface ChatViewProps {
  currentChatId: string | null;
  setCurrentChatId?: (id: string | null) => void;
}

export function ChatView({ currentChatId, setCurrentChatId }: ChatViewProps) {
  // Use our custom hooks
  const { chatDetails, chatError } = useChatDetails(currentChatId);
  const { contactName, contactTags, handleUpdateContact } = useContactDetails();
  const { messages, messagesLoading, messagesError, sendMessage } = 
    useChatMessages(currentChatId, chatDetails?.aiEnabled);

  if (!currentChatId) {
    return <EmptyState />;
  }

  if (chatError) {
    console.error('Chat details error:', chatError);
  }

  if (messagesError) {
    console.error('Messages error:', messagesError);
  }

  return (
    <>
      <ChatHeader 
        onBack={() => setCurrentChatId?.(null)}
        contactName={contactName}
        tags={contactTags}
        onUpdateContact={handleUpdateContact}
      />
      
      <div className="flex-1 overflow-y-auto px-3 py-5 md:px-5 bg-[#f5f7fb] pb-[88px] md:pb-[72px]">
        <MessageList messages={messages} isLoading={messagesLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </>
  );
}
