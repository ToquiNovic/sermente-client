// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { fullUserSlice } from "./states/fullUserSlice";
import { userSlice } from "./states/userSlice";

// Configuración de persistencia
const userPersistConfig = {
  key: "user",
  storage,
};

const fullUserPersistConfig = {
  key: "fullUser",
  storage,
};

// Reducers persistentes
const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);
const persistedFullUserReducer = persistReducer(fullUserPersistConfig, fullUserSlice.reducer);

// Configurar el store con middleware personalizado
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    fullUser: persistedFullUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar las acciones específicas de redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

