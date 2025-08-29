import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import verificationReducer from './slices/verificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    verification: verificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
