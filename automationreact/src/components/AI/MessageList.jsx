import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

export const MessageList = ({ messages, isTyping }) => {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="ai-scrollbar flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.length === 0 && (
        <div className="text-sm text-slate-400 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          Start a conversation to control the workflow or ask for help.
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 flex items-center gap-2">
            <span>Typing</span>
            <span className="flex gap-1">
              <span
                className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: "300ms" }}
              />
            </span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};
