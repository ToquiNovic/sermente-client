import { configureStore } from '@reduxjs/toolkit'
import { fullUserSlice } from './states/fullUserSlice.ts'
import { userSlice } from './states/userSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    fullUser: fullUserSlice.reducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch