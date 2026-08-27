import { useChatsList } from "./useChatsList";
import { useMessageHistory } from "./useMessageHistory";
import { useSendMessage } from "./useSendMessage";
import { useChatSocket } from "./useChatSocket";

export function useChatLogic() {
  const chatList = useChatsList();
  
  const messageHistory = useMessageHistory({
    selectedContact: chatList.selectedContact,
    chats: chatList.chats,
  });

  useChatSocket({
    selectedContact: chatList.selectedContact,
    setMessageHistories: messageHistory.setMessageHistories,
    setChats: chatList.setChats,
  });

  const sendMessage = useSendMessage({
    selectedContact: chatList.selectedContact,
    chats: chatList.chats,
    setMessageHistories: messageHistory.setMessageHistories,
    setChats: chatList.setChats,
  });

  return {
    ...chatList,
    ...messageHistory,
    ...sendMessage,
  };
}
