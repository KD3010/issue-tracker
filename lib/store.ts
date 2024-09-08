import { configureStore } from '@reduxjs/toolkit'
import * as Issues from '@/redux/issues'
import { Store } from 'lucide-react'

export const store = configureStore({
  reducer: {
    Issues: Issues.reducer
  }
})

// Infer the type of makeStore
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch