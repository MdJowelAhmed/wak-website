import { useCallback, useRef, useState, type SetStateAction } from "react";
import { loadMyChatsAction } from "../actions";
import { ApiChat } from "../types";

interface UseChatsListProps {
  initialChats: ApiChat[];
  initialChatHasMore: boolean;
  initialSelectedChatId: string | null;
}

export function useChatsList({
  initialChats,
  initialChatHasMore,
  initialSelectedChatId,
}: UseChatsListProps) {
  const [browseChats, setBrowseChats] = useState<ApiChat[]>(initialChats);
  const [searchResults, setSearchResults] = useState<ApiChat[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(initialSelectedChatId);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [searchTerm, setSearchTermState] = useState("");
  const [browsePage, setBrowsePage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [browseHasMore, setBrowseHasMore] = useState(initialChatHasMore);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [isLoadingMoreChats, setIsLoadingMoreChats] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestRef = useRef(0);
  const loadMoreRequestRef = useRef(0);

  const isSearching = searchResults !== null;
  const chats = searchResults ?? browseChats;
  const chatHasMore = isSearching ? searchHasMore : browseHasMore;

  const setChats = useCallback((action: SetStateAction<ApiChat[]>) => {
    setBrowseChats(action);
    setSearchResults((prev) => {
      if (!prev) return prev;
      return typeof action === "function" ? action(prev) : action;
    });
  }, []);

  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      const requestId = ++searchRequestRef.current;
      const query = term.trim();

      if (!query) {
        setSearchResults(null);
        setSearchPage(1);
        setSearchHasMore(false);
        setIsLoadingChats(false);
        return;
      }

      setIsLoadingChats(true);
      void loadMyChatsAction(1, query)
        .then((result) => {
          if (requestId !== searchRequestRef.current) return;
          setSearchResults(result.chats);
          setSearchPage(1);
          setSearchHasMore(result.hasMore);
        })
        .finally(() => {
          if (requestId === searchRequestRef.current) {
            setIsLoadingChats(false);
          }
        });
    }, 500);
  };

  const onLoadMoreChats = () => {
    if (isLoadingChats || isLoadingMoreChats || !chatHasMore) return;

    const query = searchTerm.trim();
    const nextPage = (isSearching ? searchPage : browsePage) + 1;
    const requestId = ++loadMoreRequestRef.current;
    setIsLoadingMoreChats(true);

    void loadMyChatsAction(nextPage, query)
      .then((result) => {
        if (requestId !== loadMoreRequestRef.current) return;

        const merge = (prev: ApiChat[]) => {
          const existingIds = new Set(prev.map((chat) => chat._id));
          const incoming = result.chats.filter((chat) => !existingIds.has(chat._id));
          return [...prev, ...incoming];
        };

        if (query) {
          setSearchResults((prev) => merge(prev ?? []));
          setSearchPage(nextPage);
          setSearchHasMore(result.hasMore);
        } else {
          setBrowseChats(merge);
          setBrowsePage(nextPage);
          setBrowseHasMore(result.hasMore);
        }
      })
      .finally(() => {
        if (requestId === loadMoreRequestRef.current) {
          setIsLoadingMoreChats(false);
        }
      });
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
