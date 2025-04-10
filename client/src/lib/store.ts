import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/slices/auth/authSlice";
import themeReducer from "@/lib/slices/theme/themeSlice";
import userJobReducer from "@/lib/slices/job/jobSlice";
import searchReducer from "@/lib/slices/search/searchSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["search"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  userJob: userJobReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
