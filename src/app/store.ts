import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { postsApi } from '../features/post/postsApiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [postsApi.reducerPath]: postsApi.reducer
  },
  // Add the API middleware for caching and invalidation
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
          .concat(postsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
