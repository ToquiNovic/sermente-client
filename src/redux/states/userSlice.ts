// redux/states/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserPerfil } from "@/models"; 

interface SetUserPayload {
  id: string;
  accessToken: string;
}

// Estado inicial corregido
const userEmptyState: User = {
  id: "",
  accessToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: userEmptyState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
    },
    createUser: (_, action: PayloadAction<User>) => action.payload,
    modifyUser: (state, action: PayloadAction<Partial<UserPerfil>>) => {
      if (state.userPerfil) {
        state.userPerfil = { ...state.userPerfil, ...action.payload };
      }
    },
    logout: (state) => {
      state.id = "";
      state.userPerfil = null;
      state.accessToken = "";
    },    
    resetUser: () => userEmptyState,
  },
});

export const { setUser, logout, modifyUser, createUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
