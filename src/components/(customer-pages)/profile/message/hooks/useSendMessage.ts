import { useState } from "react";
import { toast } from "sonner";
import { myFetch } from "../../../../../../helpers/myFetch";
import { revalidateMessageCaches } from "../actions";
import {
  ApiChat,
  appendUniqueMessage,
  mapChatMessage,
  unwrapSocketMessage,
  type ChatMessage,
} from "../types";

interface UseSendMessageProps {
  selectedContact: string | null;
  currentUserId: string;
  setMessageHistories: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  setChats: React.Dispatch<React.SetStateAction<ApiChat[]>>;
}

export function useSendMessage({
  selectedContact,
  currentUserId,
  setMessageHistories,
  setChats,
}: UseSendMessageProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
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

      const res = await myFetch("/messages/", {
        method: "POST",
        body: formData,
      });

      if (res?.success && res.data) {
        const mapped = mapChatMessage(unwrapSocketMessage(res.data) ?? res.data, currentUserId);
        const ownMessage: ChatMessage | null = mapped ? { ...mapped, sender: "user" } : null;

        if (ownMessage) {
          setMessageHistories((prev) => ({
            ...prev,
            [selectedContact]: appendUniqueMessage(prev[selectedContact] || [], ownMessage),
          }));
        }

        setChats((prevChats) => {
          const updated = prevChats.map((chat) =>
            chat._id === selectedContact
              ? { ...chat, lastMessage: { text: ownMessage?.text || "Attachment" } }
              : chat,
          );
          const currentChatIdx = updated.findIndex((chat) => chat._id === selectedContact);
          if (currentChatIdx > 0) {
            const [chatToMove] = updated.splice(currentChatIdx, 1);
            updated.unshift(chatToMove);
          }
          return updated;
        });

        setInput("");
        setSelectedFile(null);
        void revalidateMessageCaches(selectedContact);
      } else {
        toast.error(res?.message || "Failed to send message");
      }
    } catch {
      toast.error("An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
