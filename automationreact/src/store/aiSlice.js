import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  isOpen: true,
  isTyping: false,
  messages: [],
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    openSidebar(state) {
      state.isOpen = true;
    },
    closeSidebar(state) {
      state.isOpen = false;
    },
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    addMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare({ role, content, type = "chat" }) {
        return {
          payload: {
            id: nanoid(),
            role,
            content,
            type,
            createdAt: Date.now(),
          },
        };
      },
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setTyping,
  clearMessages,
  addMessage,
} = aiSlice.actions;

export default aiSlice.reducer;
