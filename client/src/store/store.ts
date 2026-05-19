import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authenticationSlice";
import contentReducer from "@/features/content/contentSlice";
import spaceReducer from "@/features/space/spaceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    space: spaceReducer,
    content: contentReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;