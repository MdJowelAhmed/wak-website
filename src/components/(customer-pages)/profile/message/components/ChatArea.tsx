import { Paperclip, Send, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useRef, useEffect } from "react";
import { ChatMessage, OfferPaymentMethod } from "../types";
import { resolveImageUrl } from "../../../../../../helpers/resolveImageUrl";
import CustomOfferCard from "./CustomOfferCard";

interface ChatAreaProps {
  currentMessages: ChatMessage[];
  isLoadingMessages: boolean;
  selectedContact: string | null;
  handleSend: (e: React.FormEvent) => void;
  input: string;
  setInput: (input: string) => void;
  isSending: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  messageHasMore?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
  handleAcceptOffer: (offerId: string, paymentMethod: OfferPaymentMethod) => Promise<void>;
  handleRejectOffer: (offerId: string, messageId: string | number) => Promise<void>;
}

export default function ChatArea({
  currentMessages,
  isLoadingMessages,
  selectedContact,
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
}: ChatAreaProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const stickToBottomRef = useRef(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 80;

    if (el.scrollTop === 0) {
      if (messageHasMore && !isLoadingMoreMessages) {
        prevScrollHeightRef.current = el.scrollHeight;
        onLoadMoreMessages?.();
      }
    }
  };

  useEffect(() => {
    stickToBottomRef.current = true;
  }, [selectedContact]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (prevScrollHeightRef.current > 0) {
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
      return;
    }

    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [currentMessages]);
  if (!selectedContact) {
    return (
      <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm min-w-0 overflow-hidden text-zinc-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-w-0 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6" ref={scrollRef} onScroll={handleScroll}>
        {isLoadingMessages && currentMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-zinc-500 text-sm">
            No messages in this conversation yet.
          </div>
        ) : (
          <>
            {isLoadingMoreMessages && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
            
            {/* Yesterday Badge */}
            <div className="flex justify-center mb-8">
              <span className="px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-150 text-xs text-zinc-500 font-semibold tracking-wide uppercase">
                Yesterday
              </span>
            </div>

            {currentMessages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div key={m.id} className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-200 -mt-2">
                    <img src={m.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="max-w-md">
                    <div className={`p-4 text-sm leading-relaxed shadow-xs ${isUser
                      ? "bg-primary/15 text-zinc-800 rounded-2xl rounded-tr-none border border-primary/25 font-medium"
                      : "bg-white text-zinc-800 rounded-2xl rounded-tl-none border border-zinc-200 font-normal"
                      }`}>
                      {m.type === 'image' && m.attachment && (
                        <div className="mb-2">
                          <img 
                            src={resolveImageUrl(m.attachment)} 
                            alt="Attachment" 
                            className="max-w-[200px] max-h-[200px] object-cover rounded-lg border border-black/10 cursor-pointer" 
                            onClick={() => window.open(resolveImageUrl(m.attachment!), '_blank')}
                          />
                        </div>
                      )}
                      {m.type === 'file' && m.attachment && (
                        <a 
                          href={resolveImageUrl(m.attachment)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-lg transition-colors w-max ${
                            isUser ? "bg-white/30 hover:bg-white/40" : "bg-black/5 hover:bg-black/10"
                          }`}
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="font-semibold text-xs">Download File</span>
                        </a>
                      )}
                      {m.type === 'custom_offer' && m.customOffer && (
                        <CustomOfferCard
                          offer={m.customOffer}
                          messageId={m.id}
                          canRespond={!isUser}
                          onAccept={handleAcceptOffer}
                          onReject={handleRejectOffer}
                        />
                      )}
                      
                      {m.text && m.text !== '📎 Attached a file' && m.text !== '🖼️ Attached an image' && !m.text.startsWith('💰 Sent a custom offer:') && (
                        <div>{m.text}</div>
                      )}
                    </div>
                    <span className={`block text-[10px] font-bold text-zinc-400 mt-1.5 ${isUser ? "text-left" : "text-right"}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="flex flex-col pt-4 border-t border-zinc-200 shrink-0 gap-2">
        {selectedFile && (
          <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-lg self-start">
            <span className="text-xs text-zinc-600 truncate max-w-[200px]">{selectedFile.name}</span>
            <button 
              type="button" 
              onClick={() => setSelectedFile(null)}
              className="text-zinc-400 hover:text-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*"
          />
          <input 
            type="file" 
            ref={docInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          
          <div className="flex items-center">
            <button 
              type="button" 
              onClick={() => imageInputRef.current?.click()}
              className="text-zinc-400 hover:text-primary transition-colors cursor-pointer p-1.5 shrink-0" 
              title="Attach Image"
              aria-label="Attach Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => docInputRef.current?.click()}
              className="text-zinc-400 hover:text-primary transition-colors cursor-pointer p-1.5 shrink-0" 
              title="Attach Document"
              aria-label="Attach Document"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
            disabled={isSending}
            className="flex-1 bg-white border border-zinc-200 focus:border-primary rounded-xl py-3 px-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:ring-1 focus:ring-primary disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={isSending || (!input.trim() && !selectedFile)}
            className="w-12 h-12 bg-primary hover:bg-orange-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-md shadow-orange-500/10 font-bold"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
