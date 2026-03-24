import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import listingReducer from "./slices/listingSlice";
import messageReducer from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
    messages: messageReducer,
  },
});

export default store;
