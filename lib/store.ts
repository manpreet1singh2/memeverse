import { configureStore } from "@reduxjs/toolkit"
import memesReducer from "@/lib/features/memes/memesSlice"
import authReducer from "@/lib/features/auth/authSlice"

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

