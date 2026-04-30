import { useEffect, useRef, useState } from "react";
import { Send, Trash } from "lucide-react";

export const ChatInput = ({ onSend, onClear, isLoading }) => {
  const [value, setValue] = useState("");
  const textAreaRef = useRef(null);

  const resize = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${Math.min(
      textAreaRef.current.scrollHeight,
      140,
    )}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="border-t border-white/10 px-4 py-4 bg-slate-900/70 backdrop-blur">
      <div className="flex items-end gap-2">
        <textarea
          ref={textAreaRef}
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the assistant to modify or run your flow..."
          className="ai-scrollbar flex-1 resize-none overflow-y-auto rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>{isLoading ? "Thinking..." : "Ready"}</span>
        <button
          onClick={onClear}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors"
        >
          <Trash size={14} />
          Clear chat
        </button>
      </div>
    </div>
  );
};
