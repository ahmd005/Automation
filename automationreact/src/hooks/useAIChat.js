import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addMessage, setTyping } from "../store/aiSlice";
import { sendPrompt } from "../services/aiService";

export const useAIChat = ({ onCommandToast, onRunAutomation } = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const shouldRunAutomation = (data) => {
    const action = String(data?.action || data?.command || data?.intent || "").toLowerCase();
    const message = String(data?.message || "").toLowerCase();
    const log = String(data?.execution_log || "").toLowerCase();
    const hasArabicRun =
      message.includes("تشغيل") ||
      message.includes("أتمتة") ||
      log.includes("تشغيل") ||
      log.includes("أتمتة");

    return (
      data?.run === true ||
      data?.execute === true ||
      action.includes("run") ||
      action.includes("execute") ||
      action.includes("automation") ||
      message.includes("run") ||
      message.includes("execute") ||
      message.includes("automation") ||
      log.includes("run") ||
      log.includes("execute") ||
      log.includes("automation") ||
      hasArabicRun
    );
  };

  const mutation = useMutation({
    mutationFn: (prompt) => sendPrompt(prompt),
    onMutate: (prompt) => {
      dispatch(addMessage({ role: "user", content: prompt }));
      dispatch(setTyping(true));
    },
    onSuccess: (data) => {
      const responseType = data?.type || "chat";
      const message = data?.message || "";

      if (responseType === "command") {
        const isAutomationRun = shouldRunAutomation(data);
        if (message) {
          dispatch(addMessage({ role: "assistant", content: message, type: "command" }));
          if (onCommandToast) {
            onCommandToast(message, "success");
          }
        }

        if (data?.execution_log) {
          dispatch(
            addMessage({
              role: "system",
              content: data.execution_log,
              type: "system",
            }),
          );
        }

        if (onRunAutomation && shouldRunAutomation(data)) {
          dispatch(
            addMessage({
              role: "system",
              content: "Executing automation...",
              type: "system",
            }),
          );
          onRunAutomation();
        }

        if (!isAutomationRun) {
          queryClient.invalidateQueries({ queryKey: ["graph"] });
          queryClient.refetchQueries({ queryKey: ["graph"], type: "all" });
        }
        return;
      }

      dispatch(
        addMessage({
          role: "assistant",
          content: message || "No response returned.",
          type: responseType,
        }),
      );
    },
    onError: () => {
      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, I could not reach the server. Please try again.",
          type: "error",
        }),
      );
    },
    onSettled: () => {
      dispatch(setTyping(false));
    },
  });

  return {
    sendMessage: mutation.mutate,
    isPending: mutation.isPending,
  };
};
