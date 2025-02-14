import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

// Import reducers
import userReducer from './UserSlice';
import postReducer from './PostSlice';
import savedReducer from './SavedSlice';
import boardReducer from './BoardSlice'; 

// Persist configurations for different slices
const userPersistConfig = { key: 'user', storage };
const postsPersistConfig = { key: 'posts', storage };
const savedPersistConfig = { key: 'save', storage };
const boardPersistConfig = { key: 'boards', storage };

// Create persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedPostsReducer = persistReducer(postsPersistConfig, postReducer);
const persistedSavedReducer = persistReducer(savedPersistConfig, savedReducer);
const persistedBoardReducer = persistReducer(boardPersistConfig, boardReducer);


// Configure the Redux store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    post: persistedPostsReducer,
    save: persistedSavedReducer,
    board: persistedBoardReducer, // Add persisted board reducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable immutability check
      serializableCheck: false, // Optionally disable serializable check
    }),
});

// Persistor for persisting the store
export const persistor = persistStore(store);

// Export the configured store
export default store;
