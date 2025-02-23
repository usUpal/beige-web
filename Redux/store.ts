import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { redirect } from 'next/navigation';
import Router from 'next/router';

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { baseApi } from './api/baseApi';
import themeConfigSlice from '@/store/themeConfigSlice';

// Configure the persistence for the auth slice
const persistConfig = {
  key: 'auth',
  storage,
};

// Create a persisted reducer for the auth slice
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Combine all reducers
const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  auth: persistedAuthReducer,
  [baseApi.reducerPath]: baseApi.reducer, // Add the RTK Query API reducer
});

const errorHandlerMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.payload && action.payload.status === 401) {
    Router.push('/errors/access-denied');
  }
  return next(action);
};

// Configure the store with the combined reducers and middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(baseApi.middleware) // Add RTK Query middleware
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Create the persistor for the store
export const persistor = persistStore(store);
