'use client';

import DashboardCard from "@/shared/DashboardCard";
import ChatSidebar from "./components/ChatSidebar";
import ChatArea from "./components/ChatArea";
import { useChatLogic } from "./hooks/useChatLogic";

interface MessagePageProps {
  currentUserId: string;
  initialChatId?: string;
}

export default function MessagePage({ currentUserId, initialChatId }: MessagePageProps) {
  const {
    chats,
    isLoadingChats,
    searchTerm,
    setSearchTerm,
    selectedContact,
    setSelectedContact,
    chatHasMore,
    isLoadingMoreChats,
    onLoadMoreChats,
    currentMessages,
    isLoadingMessages,
    handleSend,
    input,
    setInput,
    isSending,
    selectedFile,
    setSelectedFile,
    handleFileChange,
    messageHasMore,
    isLoadingMoreMessages,
    onLoadMoreMessages,
    handleAcceptOffer,
    handleRejectOffer,
  } = useChatLogic({ currentUserId, initialChatId });

  return (
    <DashboardCard>
      <div className="flex flex-col lg:flex-row gap-6 h-[700px] text-zinc-800">
        <ChatSidebar 
          chats={chats}
          currentUserId={currentUserId}
          isLoadingChats={isLoadingChats}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          chatHasMore={chatHasMore}
          isLoadingMoreChats={isLoadingMoreChats}
          onLoadMoreChats={onLoadMoreChats}
        />
        
        <ChatArea 
          currentMessages={currentMessages}
          isLoadingMessages={isLoadingMessages}
          selectedContact={selectedContact}
          handleSend={handleSend}
          input={input}
          setInput={setInput}
          isSending={isSending}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleFileChange={handleFileChange}
          messageHasMore={messageHasMore}
          isLoadingMoreMessages={isLoadingMoreMessages}
          onLoadMoreMessages={onLoadMoreMessages}
          handleAcceptOffer={handleAcceptOffer}
          handleRejectOffer={handleRejectOffer}
        />
      </div>
    </DashboardCard>
  );
}
