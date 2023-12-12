import {configureStore} from '@reduxjs/toolkit';

import rootReducer from "./rootReducer";
import logger from "redux-logger";

const middlewares = [logger];

export const configuredStore = (initialState) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(middlewares);

      return middleware;
    },
    devTools: process.env.NODE_ENV === "development",
    preloadedState: initialState,
  });
};

const store = configuredStore();

export default store;
