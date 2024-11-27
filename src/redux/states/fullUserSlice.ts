import { UserEntity } from '@/models'
import { createSlice } from '@reduxjs/toolkit'

const fullUserEmptyState: UserEntity = {
  id: '',
  role: '',
  status: '',
  username: ''
}

export const fullUserSlice = createSlice({
  name: 'fullUser',
  initialState: fullUserEmptyState,
  reducers: {
    createFullUser: (_, action) => action.payload,
    modifyFullUser: (state, action) => ({ ...state, ...action.payload }),
    resetFullUser: () => fullUserEmptyState
  }
})

export const { createFullUser, modifyFullUser, resetFullUser } =
  fullUserSlice.actions

export default fullUserSlice.reducer