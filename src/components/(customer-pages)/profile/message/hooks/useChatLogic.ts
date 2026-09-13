import { useChatsList } from "./useChatsList";
import { useMessageHistory } from "./useMessageHistory";
import { useSendMessage } from "./useSendMessage";
import { useChatSocket } from "./useChatSocket";

interface UseChatLogicProps {
  currentUserId: string;
  initialChatId?: string;
}

export function useChatLogic({ currentUserId, initialChatId }: UseChatLogicProps) {
  const chatList = useChatsList({ initialChatId });

  const messageHistory = useMessageHistory({
    selectedContact: chatList.selectedContact,
    currentUserId,
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

  return {
    ...chatList,
    ...messageHistory,
    ...sendMessage,
  };
}
