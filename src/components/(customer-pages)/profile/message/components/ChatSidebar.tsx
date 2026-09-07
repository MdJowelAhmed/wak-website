import { Search, Loader2 } from "lucide-react";
import { resolveImageUrl } from "../../../../../../helpers/resolveImageUrl";
import { ApiChat } from "../types";

interface ChatSidebarProps {
  chats: ApiChat[];
  isLoadingChats: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedContact: string | null;
  setSelectedContact: (id: string) => void;
  chatHasMore?: boolean;
  isLoadingMoreChats?: boolean;
  onLoadMoreChats?: () => void;
}

export default function ChatSidebar({
  chats,
  isLoadingChats,
  searchTerm,
  setSearchTerm,
  selectedContact,
  setSelectedContact,
  chatHasMore,
  isLoadingMoreChats,
  onLoadMoreChats,
}: ChatSidebarProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      onLoadMoreChats?.();
    }
  };
  return (
    <div className="w-full lg:w-80 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col shrink-0 shadow-sm">
      <h1 className="text-xl font-bold text-zinc-900 mb-5 tracking-tight">Message</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chats..."
          className="w-full bg-white border border-zinc-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1" onScroll={handleScroll}>
        {isLoadingChats ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-8">
            No chats found
          </div>
        ) : (
          chats.map((chat) => {
            const participant = chat.participants?.[0];
            const avatarUrl = participant?.profileImage ? resolveImageUrl(participant.profileImage) : "/user.svg";
            const participantName = participant?.name || "Unknown User";
            const subtitle = chat.lastMessage?.text || "No messages yet";
            
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedContact(chat._id)}
                className={`flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-colors ${selectedContact === chat._id
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-white hover:bg-zinc-100/50 border border-zinc-200/50"
                  }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-200">
                  <img src={avatarUrl} alt={participantName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-sm ${selectedContact === chat._id ? "text-primary" : "text-zinc-800"}`}>{participantName}</h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{subtitle}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">{chat.unreadCount}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        
        {isLoadingMoreChats && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
