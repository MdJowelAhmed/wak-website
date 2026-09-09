import { useState } from "react";
import { toast } from "sonner";
import { myFetch } from "../../../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../../../helpers/resolveImageUrl";
import { ApiChat, ChatMessage, mapCustomOffer } from "../types";

interface UseSendMessageProps {
  selectedContact: string | null;
  chats: ApiChat[];
  setMessageHistories: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  setChats: React.Dispatch<React.SetStateAction<ApiChat[]>>;
}

export function useSendMessage({ selectedContact, chats, setMessageHistories, setChats }: UseSendMessageProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    if (!input.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("chat", selectedContact);
      
      let msgType = "text";
      if (selectedFile) {
        if (selectedFile.type.startsWith("image/")) {
          msgType = "image";
          formData.append("image", selectedFile);
        } else {
          msgType = "file";
          formData.append("doc", selectedFile);
        }
      }
      
      formData.append("type", msgType);
      if (input.trim()) {
        formData.append("text", input.trim());
      }

      const res = await myFetch('/messages/', {
        method: 'POST',
        body: formData
      });

      if (res?.success && res.data) {
        const m = res.data;
        const currentChat = chats.find((c) => c._id === selectedContact);
        const otherId = currentChat?.participants?.[0]?._id;
        const isUser = otherId ? m.sender?._id !== otherId : false;
        const text = m.text;

        setMessageHistories(prev => {
          const currentMsgs = prev[selectedContact] || [];
          
          let finalAvatar = m.sender?.profileImage ? resolveImageUrl(m.sender.profileImage) : "/user.svg";
          if (finalAvatar === "/user.svg") {
            const existingMsg = currentMsgs.find(msg => msg.sender === (isUser ? 'user' : 'other') && msg.avatar !== "/user.svg");
            if (existingMsg) {
              finalAvatar = existingMsg.avatar;
            }
          }

          const newMsg: ChatMessage = {
            id: m._id,
            sender: isUser ? 'user' : 'other',
            text: text || '',
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: finalAvatar,
            type: m.type,
            attachment: m.attachment,
            customOffer: mapCustomOffer(m.customOffer),
          };

          return {
            ...prev,
            [selectedContact]: [...currentMsgs, newMsg]
          };
        });
        
        setChats(prevChats => {
          const updated = prevChats.map(c => {
            if (c._id === selectedContact) {
              return {
                ...c,
                lastMessage: { text: text || 'Attachment' },
                updatedAt: new Date().toISOString()
              };
            }
            return c;
          });
          const currentChatIdx = updated.findIndex(c => c._id === selectedContact);
          if (currentChatIdx > 0) {
            const chatToMove = updated[currentChatIdx];
            updated.splice(currentChatIdx, 1);
            updated.unshift(chatToMove);
          }
          return updated;
        });

        setInput("");
        setSelectedFile(null);
      } else {
        toast.error(res?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return {
    input,
    setInput,
    isSending,
    selectedFile,
    setSelectedFile,
    handleSend,
    handleFileChange,
  };
}
