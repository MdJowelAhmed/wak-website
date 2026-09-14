import { useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { myFetch } from "../../../../../../helpers/myFetch";
import { loadChatMessagesAction, revalidateMessageCaches } from "../actions";
import { ChatMessage, OfferPaymentMethod } from "../types";

interface UseMessageHistoryProps {
  selectedContact: string | null;
  initialChatId: string | null;
  initialMessages: ChatMessage[];
  initialMessageHasMore: boolean;
}

export function useMessageHistory({
  selectedContact,
  initialChatId,
  initialMessages,
  initialMessageHasMore,
}: UseMessageHistoryProps) {
  const t = useTranslations("Messages");
  const [messageHistories, setMessageHistories] = useState<Record<string, ChatMessage[]>>(
    initialChatId ? { [initialChatId]: initialMessages } : {},
  );
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagePages, setMessagePages] = useState<Record<string, number>>(
    initialChatId ? { [initialChatId]: 1 } : {},
  );
  const [hasMoreByChat, setHasMoreByChat] = useState<Record<string, boolean>>(
    initialChatId ? { [initialChatId]: initialMessageHasMore } : {},
  );
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

  const loadedChatsRef = useRef<Set<string>>(new Set(initialChatId ? [initialChatId] : []));
  const loadingChatRef = useRef<string | null>(null);
  const loadMoreRequestRef = useRef(0);

  const mergePageOne = (chatId: string, fetched: ChatMessage[]) => {
    setMessageHistories((prev) => {
      const existing = prev[chatId] || [];
      const fetchedIds = new Set(fetched.map((message) => message.id));
      const extraRealtime = existing.filter((message) => !fetchedIds.has(message.id));
      return { ...prev, [chatId]: [...fetched, ...extraRealtime] };
    });
  };

  const ensureMessagesLoaded = (chatId: string) => {
    if (!chatId || loadedChatsRef.current.has(chatId) || loadingChatRef.current === chatId) {
      return;
    }

    loadingChatRef.current = chatId;
    setIsLoadingMessages(true);

    void loadChatMessagesAction(chatId, 1)
      .then((result) => {
        loadedChatsRef.current.add(chatId);
        mergePageOne(chatId, result.messages);
        setMessagePages((prev) => ({ ...prev, [chatId]: 1 }));
        setHasMoreByChat((prev) => ({ ...prev, [chatId]: result.hasMore }));
      })
      .catch(() => {
        toast.error(t("loadError"));
      })
      .finally(() => {
        if (loadingChatRef.current === chatId) {
          loadingChatRef.current = null;
        }
        setIsLoadingMessages(false);
      });
  };

  const currentMessages = (selectedContact && messageHistories[selectedContact]) || [];
  const messageHasMore = selectedContact ? Boolean(hasMoreByChat[selectedContact]) : false;

  const handleAcceptOffer = async (offerId: string, paymentMethod: OfferPaymentMethod) => {
    try {
      const res = await myFetch(`/custom-offers/${offerId}/accept`, {
        method: "POST",
        body: { paymentMethod },
      });
      const checkoutUrl =
        res?.success && typeof res.data?.checkoutUrl === "string"
          ? res.data.checkoutUrl
          : null;

      if (selectedContact) {
        void revalidateMessageCaches(selectedContact);
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      toast.error(res?.message || t("paymentError"));
    } catch {
      toast.error(t("acceptError"));
    }
  };

  const handleRejectOffer = async (offerId: string, messageId: string | number) => {
    try {
      const res = await myFetch(`/custom-offers/${offerId}/reject`, { method: "POST" });
      if (!res?.success) {
        toast.error(res?.message || t("rejectError"));
        return;
      }
      if (!selectedContact) return;
      setMessageHistories((prev) => {
        const chatHistory = prev[selectedContact] || [];
        return {
          ...prev,
          [selectedContact]: chatHistory.map((msg) => {
            if (msg.id === messageId && msg.customOffer) {
              return {
                ...msg,
                customOffer: { ...msg.customOffer, status: "rejected" },
              };
            }
            return msg;
          }),
        };
      });
      void revalidateMessageCaches(selectedContact);
      toast.success(t("rejectSuccess"));
    } catch {
      toast.error(t("rejectError"));
    }
  };

  const onLoadMoreMessages = () => {
    if (!selectedContact || isLoadingMessages || isLoadingMoreMessages || !messageHasMore) {
      return;
    }

    const nextPage = (messagePages[selectedContact] || 1) + 1;
    const chatId = selectedContact;
    const requestId = ++loadMoreRequestRef.current;
    setIsLoadingMoreMessages(true);

    void loadChatMessagesAction(chatId, nextPage)
      .then((result) => {
        if (requestId !== loadMoreRequestRef.current) return;
        setMessageHistories((prev) => {
          const existing = prev[chatId] || [];
          const existingIds = new Set(existing.map((message) => message.id));
          const incoming = result.messages.filter((message) => !existingIds.has(message.id));
          return { ...prev, [chatId]: [...incoming, ...existing] };
        });
        setMessagePages((prev) => ({ ...prev, [chatId]: nextPage }));
        setHasMoreByChat((prev) => ({ ...prev, [chatId]: result.hasMore }));
      })
      .catch(() => {
        toast.error(t("loadError"));
      })
      .finally(() => {
        if (requestId === loadMoreRequestRef.current) {
          setIsLoadingMoreMessages(false);
        }
      });
  };

  return {
    messageHistories,
    setMessageHistories,
    currentMessages,
    isLoadingMessages,
    messageHasMore,
    isLoadingMoreMessages,
    onLoadMoreMessages,
    ensureMessagesLoaded,
    handleAcceptOffer,
    handleRejectOffer,
  };
}
