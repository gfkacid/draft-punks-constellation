import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "./storage";

import auth from "store/auth/slice";
import premiership from "store/premiership/slice";
import tournaments from "store/lobby/slice"

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["authIsInitialized"],
};
const premiershipPersistConfig = { key: "premiership", storage };

const combinedReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  premiership: persistReducer(premiershipPersistConfig, premiership),
  tournaments
  
});

function rootReducers(state, action) {
  switch (action.type) {
    default:
      return combinedReducer(state, action);
  }
}

export default rootReducers;
