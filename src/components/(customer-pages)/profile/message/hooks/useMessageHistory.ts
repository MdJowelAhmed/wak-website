import { useState, useEffect } from "react";
import { myFetch } from "../../../../../../helpers/myFetch";
import { toast } from "sonner";
import { ChatMessage, OfferPaymentMethod, mapChatMessage } from "../types";

const initialMessages: Record<string, ChatMessage[]> = {};

interface UseMessageHistoryProps {
  selectedContact: string | null;
  currentUserId: string;
}

export function useMessageHistory({ selectedContact, currentUserId }: UseMessageHistoryProps) {
  const [messageHistories, setMessageHistories] = useState(initialMessages);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [messageHasMore, setMessageHasMore] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

  useEffect(() => {
    setMessagePage(1);
    setMessageHasMore(true);
  }, [selectedContact]);

  useEffect(() => {
    if (!selectedContact || !currentUserId) return;

    const fetchMessages = async () => {
      if (messagePage === 1) setIsLoadingMessages(true);
      else setIsLoadingMoreMessages(true);
      
      try {
        const res = await myFetch(`/messages/chats/${selectedContact}?page=${messagePage}&limit=15`, { cache: "no-store" });
        if (res?.success && Array.isArray(res.data)) {
          const mapped = res.data
            .map((item: unknown) => mapChatMessage(item, currentUserId))
            .filter((item): item is ChatMessage => item !== null)
            .reverse();

          setMessageHistories((prev) => {
            const existing = prev[selectedContact] || [];
            if (messagePage === 1) {
              const fetchedIds = new Set(mapped.map((message) => message.id));
              const extraRealtime = existing.filter((message) => !fetchedIds.has(message.id));
              return { ...prev, [selectedContact]: [...mapped, ...extraRealtime] };
            } else {
              const existingIds = new Set((prev[selectedContact] || []).map(m => m.id));
              const newMapped = mapped.filter(m => !existingIds.has(m.id));
              
              return {
                ...prev,
                [selectedContact]: [...newMapped, ...(prev[selectedContact] || [])]
              };
            }
          });

          if (res.pagination) {
            setMessageHasMore(messagePage < res.pagination.totalPage);
          } else {
            setMessageHasMore(res.data.length === 15);
          }
        }
      } catch {
        toast.error("Could not load messages.");
      } finally {
        setIsLoadingMessages(false);
        setIsLoadingMoreMessages(false);
      }
    };

    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact, messagePage, currentUserId]);

  const currentMessages = (selectedContact && messageHistories[selectedContact]) || [];

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

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      toast.error(res?.message || "Could not start payment. Please try again.");
    } catch {
      toast.error("Could not accept this offer.");
    }
  };

  const handleRejectOffer = async (offerId: string, messageId: string | number) => {
    try {
      const res = await myFetch(`/custom-offers/${offerId}/reject`, { method: "POST" });
      if (!res?.success) {
        toast.error(res?.message || "Could not reject this offer.");
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
      toast.success("Offer rejected.");
    } catch {
      toast.error("Could not reject this offer.");
    }
  };

  const onLoadMoreMessages = () => {
    if (!isLoadingMessages && !isLoadingMoreMessages && messageHasMore) {
      setMessagePage(prev => prev + 1);
    }
  };

  return {
    messageHistories,
    setMessageHistories,
    currentMessages,
    isLoadingMessages,
    messageHasMore,
    isLoadingMoreMessages,
    onLoadMoreMessages,
    handleAcceptOffer,
    handleRejectOffer,
  };
}
