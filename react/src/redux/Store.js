// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./user/UserSlice"; // Correct path

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   devTools: process.env.NODE_ENV !== "production",
// });
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/UserSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

// Persist configuration
const persistConfig = {
  key: "root", // Key for the persisted state
  storage,     // Default storage is localStorage
  whitelist: ["user"], // Specify which reducers you want to persist (optional)
};

// Combine reducers (if you have more reducers)
const rootReducer = combineReducers({
  user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

// Create a persistor
export const persistor = persistStore(store);
