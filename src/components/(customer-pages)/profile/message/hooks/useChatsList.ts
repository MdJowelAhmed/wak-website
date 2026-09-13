import { useState, useEffect } from "react";
import { myFetch } from "../../../../../../helpers/myFetch";
import { ApiChat } from "../types";

interface UseChatsListProps {
  initialChatId?: string;
}

export function useChatsList({ initialChatId }: UseChatsListProps = {}) {
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(initialChatId || null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [chatPage, setChatPage] = useState(1);
  const [chatHasMore, setChatHasMore] = useState(true);
  const [isLoadingMoreChats, setIsLoadingMoreChats] = useState(false);

  useEffect(() => {
    setChatPage(1);
    setChats([]);
    setChatHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    const fetchChats = async () => {
      if (chatPage === 1) setIsLoadingChats(true);
      else setIsLoadingMoreChats(true);
      
      try {
        let endpoint = `/chats/mine?page=${chatPage}&limit=10`;
        if (searchTerm.trim()) {
          endpoint += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        }
        
        const res = await myFetch(endpoint, { cache: "no-store" });
        if (res?.success && Array.isArray(res.data)) {
          if (chatPage === 1) {
            setChats(res.data);
            if (!selectedContact && res.data.length > 0) {
              setSelectedContact(res.data[0]._id);
            }
          } else {
            setChats(prev => {
              const existingIds = new Set(prev.map(c => c._id));
              const newChats = res.data.filter((c: any) => !existingIds.has(c._id));
              return [...prev, ...newChats];
            });
          }
          
          if (res.pagination) {
            setChatHasMore(chatPage < res.pagination.totalPage);
          } else {
            setChatHasMore(res.data.length === 10);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoadingChats(false);
        setIsLoadingMoreChats(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, chatPage]);

  const onLoadMoreChats = () => {
    if (!isLoadingChats && !isLoadingMoreChats && chatHasMore) {
      setChatPage(prev => prev + 1);
    }
  };

  return {
    chats,
    setChats,
    selectedContact,
    setSelectedContact,
    isLoadingChats,
    searchTerm,
    setSearchTerm,
    chatHasMore,
    isLoadingMoreChats,
    onLoadMoreChats,
  };
}
