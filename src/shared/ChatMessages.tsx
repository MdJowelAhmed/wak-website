// src/components/shared/message/ChatMessages.tsx
import React from "react";
import { ChatMessage } from "@/constants/mockChatData";

export interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
      {/* Yesterday Badge */}
      <div className="flex justify-center mb-8">
        <span className="px-4 py-1.5 rounded-full border border-zinc-800 bg-[#111111]/40 text-xs text-zinc-400 font-medium tracking-wide uppercase">
          Yesterday
        </span>
      </div>

      {messages.map((m) => {
        const isUser = m.senderId === currentUserId;
        return (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${
              isUser ? "justify-end flex-row-reverse" : "justify-start"
            }`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-zinc-600">
              <img src={m.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-md">
              <div
                className={`p-4 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-[#2e2e2e] text-zinc-200 rounded-2xl rounded-tr-none border border-zinc-700/50 font-normal"
                    : "bg-[#2e2e2e] text-zinc-200 rounded-2xl rounded-tl-none border border-zinc-700/50 font-normal"
                }`}
              >
                {m.text}
              </div>
              <span
                className={`block text-xs font-semibold text-[#3b82f6] mt-1.5 ${
                  isUser ? "text-left" : "text-right"
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
