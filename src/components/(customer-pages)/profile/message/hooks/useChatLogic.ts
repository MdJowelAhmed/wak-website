import { useChatsList } from "./useChatsList";
import { useMessageHistory } from "./useMessageHistory";
import { useSendMessage } from "./useSendMessage";
import { useChatSocket } from "./useChatSocket";
import type { ApiChat, ChatMessage } from "../types";

interface UseChatLogicProps {
  currentUserId: string;
  selectedChatId: string | null;
  chats: ApiChat[];
  chatHasMore: boolean;
  messages: ChatMessage[];
  messageHasMore: boolean;
}

export function useChatLogic({
  currentUserId,
  selectedChatId,
  chats,
  chatHasMore,
  messages,
  messageHasMore,
}: UseChatLogicProps) {
  const chatList = useChatsList({
    initialChats: chats,
    initialChatHasMore: chatHasMore,
    initialSelectedChatId: selectedChatId,
  });

  const messageHistory = useMessageHistory({
    selectedContact: chatList.selectedContact,
    initialChatId: selectedChatId,
    initialMessages: messages,
    initialMessageHasMore: messageHasMore,
  });

  useChatSocket({
    selectedContact: chatList.selectedContact,
    currentUserId,
    setMessageHistories: messageHistory.setMessageHistories,
    setChats: chatList.setChats,
  });

  const sendMessage = useSendMessage({
    selectedContact: chatList.selectedContact,
    currentUserId,
    setMessageHistories: messageHistory.setMessageHistories,
    setChats: chatList.setChats,
  });

  const setSelectedContact = (id: string) => {
    chatList.setSelectedContact(id);
    messageHistory.ensureMessagesLoaded(id);
  };

  return {
    ...chatList,
    ...messageHistory,
    ...sendMessage,
    setSelectedContact,
  };
}
