import api from "../api/axios";

export const sendPrompt = async (prompt) => {
  const { data } = await api.post("/api/ai/chat", { prompt });
  return data;
};
