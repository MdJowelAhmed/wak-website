'use client';

import DashboardCard from "@/shared/DashboardCard";
import ChatSidebar from "./components/ChatSidebar";
import ChatArea from "./components/ChatArea";
import { useChatLogic } from "./hooks/useChatLogic";
import type { MessagePageBootstrap } from "./types";

export default function MessagePage({
  currentUserId,
  selectedChatId,
  chats,
  chatHasMore,
  messages,
  messageHasMore,
}: MessagePageBootstrap) {
  const {
    chats: chatList,
    isLoadingChats,
    searchTerm,
    setSearchTerm,
    selectedContact,
    setSelectedContact,
    chatHasMore: hasMoreChats,
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
    messageHasMore: hasMoreMessages,
    isLoadingMoreMessages,
    onLoadMoreMessages,
    handleAcceptOffer,
    handleRejectOffer,
  } = useChatLogic({
    currentUserId,
    selectedChatId,
    chats,
    chatHasMore,
    messages,
    messageHasMore,
  });

  return (
    <DashboardCard>
      <div className="flex flex-col lg:flex-row gap-6 h-[700px] text-zinc-800">
        <ChatSidebar 
          chats={chatList}
          currentUserId={currentUserId}
          isLoadingChats={isLoadingChats}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          chatHasMore={hasMoreChats}
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
          messageHasMore={hasMoreMessages}
          isLoadingMoreMessages={isLoadingMoreMessages}
          onLoadMoreMessages={onLoadMoreMessages}
          handleAcceptOffer={handleAcceptOffer}
          handleRejectOffer={handleRejectOffer}
        />
      </div>
    </DashboardCard>
  );
}
