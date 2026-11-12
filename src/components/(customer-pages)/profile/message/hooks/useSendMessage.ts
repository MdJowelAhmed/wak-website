import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { MAX_UPLOAD_FILE_MB, isUploadWithinLimit } from "../../../../../../helpers/upload-limits";
import { invokeMyFetch, MY_FETCH_UPLOAD_TOO_LARGE } from "@/lib/invoke-my-fetch";
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
  const t = useTranslations("Messages");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedContact) return;
    if (!input.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      if (selectedFile && !isUploadWithinLimit(selectedFile)) {
        toast.error(t("uploadTooLarge", { maxMb: MAX_UPLOAD_FILE_MB }));
        return;
      }

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

      const res = await invokeMyFetch("/messages/", {
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
              ? { ...chat, lastMessage: { text: ownMessage?.text || t("attachment") } }
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
      } else if (res?.message === MY_FETCH_UPLOAD_TOO_LARGE) {
        toast.error(t("uploadTooLarge", { maxMb: MAX_UPLOAD_FILE_MB }));
      } else {
        toast.error(res?.message || t("sendError"));
      }
    } catch {
      toast.error(t("sendUnexpected"));
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isUploadWithinLimit(file)) {
      toast.error(t("uploadTooLarge", { maxMb: MAX_UPLOAD_FILE_MB }));
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
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
