import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { closeSidebar, clearMessages } from "../../store/aiSlice";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useAIChat } from "../../hooks/useAIChat";

export const ChatSidebar = ({ showToast, onRunAutomation }) => {
  const dispatch = useDispatch();
  const { isOpen, isTyping, messages } = useSelector((state) => state.ai);
  const { sendMessage, isPending } = useAIChat({
    onCommandToast: showToast,
    onRunAutomation,
  });

  const handleClose = () => dispatch(closeSidebar());
  const handleClear = () => dispatch(clearMessages());

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="relative h-full w-90 max-w-full z-20 bg-slate-900/70 backdrop-blur-xl border-l border-white/10 shadow-[-8px_0_30px_rgba(0,0,0,0.35)] flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <Sparkles className="text-blue-300" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span
                className={`h-2 w-2 rounded-full ${
                  isTyping ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              <span>{isTyping ? "Typing" : "Online"}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Close AI sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <MessageList messages={messages} isTyping={isTyping} />

      <ChatInput
        onSend={sendMessage}
        onClear={handleClear}
        isLoading={isTyping || isPending}
      />
    </motion.aside>
  );
};
