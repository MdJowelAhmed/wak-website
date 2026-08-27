import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { resolveImageUrl } from "../../../../../../helpers/resolveImageUrl";
import { ApiChat, ChatMessage } from "../types";

interface UseChatSocketProps {
  selectedContact: string | null;
  setMessageHistories: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  setChats: React.Dispatch<React.SetStateAction<ApiChat[]>>;
}

export function useChatSocket({ selectedContact, setMessageHistories, setChats }: UseChatSocketProps) {
  const selectedContactRef = useRef(selectedContact);
  useEffect(() => { selectedContactRef.current = selectedContact; }, [selectedContact]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4060";
    
    const socketInstance: Socket = io(baseUrl, { 
      extraHeaders: {
        token: token || "",
      }
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketInstance.on("message:new", (m: any) => {
      let text = m.text;
      
      const chatId = typeof m.chat === 'object' ? m.chat._id : m.chat;

      // Update message histories
      setMessageHistories(prev => {
        if (!prev[chatId]) return prev;
        
        const currentMsgs = prev[chatId];
        
        let finalAvatar = m.sender?.profileImage ? resolveImageUrl(m.sender.profileImage) : "/user.svg";
        if (finalAvatar === "/user.svg") {
          const existingMsg = currentMsgs.find(msg => msg.sender === 'other' && msg.avatar !== "/user.svg");
          if (existingMsg) {
            finalAvatar = existingMsg.avatar;
          }
        }

        const newMsg: ChatMessage = {
          id: m._id,
          sender: 'other', 
          text: text || '',
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: finalAvatar,
          type: m.type,
          attachment: m.attachment,
          customOffer: m.customOffer,
        };
        
        if (currentMsgs.some(existing => existing.id === newMsg.id)) {
          return prev;
        }

        return {
          ...prev,
          [chatId]: [...currentMsgs, newMsg]
        };
      });

      // Update the sidebar's lastMessage and unreadCount
      setChats(prevChats => {
        const updated = prevChats.map(c => {
          if (c._id === chatId) {
            return {
              ...c,
              lastMessage: { text: text || 'Attachment' },
              updatedAt: m.createdAt || new Date().toISOString(),
              unreadCount: selectedContactRef.current === chatId ? c.unreadCount : (c.unreadCount || 0) + 1
            };
          }
          return c;
        });
        
        const chatIdx = updated.findIndex(c => c._id === chatId);
        if (chatIdx > 0) {
          const chatToMove = updated[chatIdx];
          updated.splice(chatIdx, 1);
          updated.unshift(chatToMove);
        }
        return updated;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
