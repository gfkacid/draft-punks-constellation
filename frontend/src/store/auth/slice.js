import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  isAuthenticated: false,
  user: null,
  entries: [],
};

const slice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    loginUser: (state, { payload }) => {
      state.isAuthenticated = true;
      state.user = payload.user;
      state.entries = payload.entries;

      return state;
    },
  },
});

export const {
  loginUser,
} = slice.actions;

export default slice.reducer;
