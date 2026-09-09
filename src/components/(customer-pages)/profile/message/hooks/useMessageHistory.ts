import { useState, useEffect } from "react";
import { myFetch } from "../../../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../../../helpers/resolveImageUrl";
import { toast } from "sonner";
import { ApiChat, ChatMessage, OfferPaymentMethod, mapCustomOffer } from "../types";

const initialMessages: Record<string, ChatMessage[]> = {};

interface UseMessageHistoryProps {
  selectedContact: string | null;
  chats: ApiChat[];
}

export function useMessageHistory({ selectedContact, chats }: UseMessageHistoryProps) {
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
    if (!selectedContact) return;
    
    if (messagePage === 1 && messageHistories[selectedContact]?.length > 0) {
      return; 
    }

    const fetchMessages = async () => {
      if (messagePage === 1) setIsLoadingMessages(true);
      else setIsLoadingMoreMessages(true);
      
      try {
        const res = await myFetch(`/messages/chats/${selectedContact}?page=${messagePage}&limit=15`, { cache: "no-store" });
        if (res?.success && Array.isArray(res.data)) {
          const currentChat = chats.find((c) => c._id === selectedContact);
          const otherId = currentChat?.participants?.[0]?._id;

          const mapped: ChatMessage[] = res.data.map((m: any) => {
            const isUser = otherId ? m.sender?._id !== otherId : false;
            const text = m.text;

            return {
              id: m._id,
              sender: isUser ? 'user' : 'other',
              text: text || '',
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: m.sender?.profileImage ? resolveImageUrl(m.sender.profileImage) : "/user.svg",
              type: m.type,
              attachment: m.attachment,
              customOffer: mapCustomOffer(m.customOffer),
            };
          });
          
          mapped.reverse();

          setMessageHistories(prev => {
            if (messagePage === 1) {
              return { ...prev, [selectedContact]: mapped };
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
  }, [selectedContact, messagePage]);

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
