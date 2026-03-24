import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentMessages: [],
  currentConversation: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.loading = false;
    },
    setCurrentMessages: (state, action) => {
      state.currentMessages = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      state.currentMessages.push(action.payload);
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setConversations,
  setCurrentMessages,
  addMessage,
  setCurrentConversation,
  setUnreadCount,
  setError,
} = messageSlice.actions;
export default messageSlice.reducer;
