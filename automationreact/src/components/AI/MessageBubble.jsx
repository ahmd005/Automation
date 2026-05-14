import ReactMarkdown from "react-markdown";
import { Bot, User, Sparkles } from "lucide-react";

const roleStyles = {
  user: {
    container: "justify-end",
    bubble: "bg-blue-600/80 border border-blue-400/30 text-white",
    icon: User,
    label: "You",
  },
  assistant: {
    container: "justify-start",
    bubble: "bg-slate-800/80 border border-white/10 text-slate-100",
    icon: Bot,
    label: "AI",
  },
  system: {
    container: "justify-start",
    bubble:
      "bg-amber-500/10 border border-amber-300/30 text-amber-100 font-mono text-xs",
    icon: Sparkles,
    label: "System",
  },
};

export const MessageBubble = ({ message }) => {
  const config = roleStyles[message.role] || roleStyles.assistant;
  const Icon = config.icon;

  return (
    <div className={`flex ${config.container}`}>
      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${config.bubble}`}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/60 mb-2">
          <Icon size={12} />
          <span>{config.label}</span>
        </div>
        {message.role === "assistant" ? (
          <ReactMarkdown className="prose prose-invert max-w-none text-sm leading-relaxed">
            {message.content}
          </ReactMarkdown>
        ) : message.role === "system" ? (
          <pre className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </pre>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
};
