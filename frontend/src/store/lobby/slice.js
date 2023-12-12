import { createSlice } from "@reduxjs/toolkit";
import { getTournaments } from "./actions";

const INITIAL_STATE = {
  tournaments: [],
};

const slice = createSlice({
  name: "tournaments",
  initialState: INITIAL_STATE,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(getTournaments.fulfilled , (state, {payload}) => {
        state.tournaments = payload;
        return state
    })
  }
});

export default slice.reducer;
