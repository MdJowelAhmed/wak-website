// src/components/shared/message/ChatInput.tsx
import React from "react";
import { Paperclip, Send } from "lucide-react";

export interface ChatInputProps {
  input: string;
  onInputChange: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export function ChatInput({ input, onInputChange, onSend }: ChatInputProps) {
  return (
    <form onSubmit={onSend} className="flex items-center gap-4 pt-4 border-t border-zinc-800 shrink-0">
      <button
        type="button"
        className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5 shrink-0"
        aria-label="Add attachment"
      >
        <Paperclip className="w-5 h-5 -rotate-45" />
      </button>

      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type here..."
        className="flex-1 bg-[#282828] border border-zinc-700/60 focus:border-[#FF6700] rounded-xl py-3 px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-500"
      />

      <button
        type="submit"
        disabled={!input.trim()}
        className="w-12 h-12 bg-[#fbe1b3] hover:bg-[#f3d299] disabled:opacity-50 text-zinc-950 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-md font-bold"
        aria-label="Send message"
      >
        <Send className="w-5 h-5 stroke-[2.2]" />
      </button>
    </form>
  );
}
