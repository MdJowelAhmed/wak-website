import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import {
  ApiChat,
  appendUniqueMessage,
  mapChatMessage,
  readEntityId,
  unwrapSocketMessage,
  type ChatMessage,
} from "../types";

function joinChat(socket: Socket, chatId: string | null) {
  if (!chatId) return;
  socket.emit("join", chatId);
  socket.emit("join", { chatId });
  socket.emit("chat:join", chatId);
}

interface UseChatSocketProps {
  selectedContact: string | null;
  currentUserId: string;
  setMessageHistories: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  setChats: React.Dispatch<React.SetStateAction<ApiChat[]>>;
}

export function useChatSocket({
  selectedContact,
  currentUserId,
  setMessageHistories,
  setChats,
}: UseChatSocketProps) {
  const selectedContactRef = useRef(selectedContact);
  const currentUserIdRef = useRef(currentUserId);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4060";
    const socket = io(baseUrl, {
      transports: ["websocket", "polling"],
      auth: { token },
      query: { token },
      extraHeaders: {
        token,
        authorization: `Bearer ${token}`,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      joinChat(socket, selectedContactRef.current);
    });

    const handleNewMessage = (payload: unknown) => {
      const raw = unwrapSocketMessage(payload);
      if (!raw) return;

      const chatId = readEntityId(raw.chat) || (typeof raw.chatId === "string" ? raw.chatId : "");
      if (!chatId) return;

      const mapped = mapChatMessage(raw, currentUserIdRef.current);
      if (!mapped) return;

      setMessageHistories((prev) => ({
        ...prev,
        [chatId]: appendUniqueMessage(prev[chatId] || [], mapped),
      }));

      setChats((prevChats) => {
        const updated = prevChats.map((chat) => {
          if (chat._id !== chatId) return chat;
          const isOwn = mapped.sender === "user";
          const isOpen = selectedContactRef.current === chatId;
          return {
            ...chat,
            lastMessage: { text: mapped.text || "Attachment" },
            unreadCount: isOwn || isOpen ? chat.unreadCount : (chat.unreadCount || 0) + 1,
          };
        });

        const chatIdx = updated.findIndex((chat) => chat._id === chatId);
        if (chatIdx > 0) {
          const [chatToMove] = updated.splice(chatIdx, 1);
          updated.unshift(chatToMove);
        }
        return updated;
      });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("newMessage", handleNewMessage);
    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [setChats, setMessageHistories]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    joinChat(socket, selectedContact);
  }, [selectedContact]);
}
