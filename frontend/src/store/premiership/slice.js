import { createSlice } from "@reduxjs/toolkit";
import { getPremiershipData } from "./actions";

const INITIAL_STATE = {
  gameweeks: [],
  fixtures: [],
  teams: [],
  players: []
};

const slice = createSlice({
  name: "premiership",
  initialState: INITIAL_STATE,
  reducers: {
    setPremiership: (state, { payload }) => {
      state.premiership = payload;

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPremiershipData.fulfilled , (state, {payload}) => {
        state.gameweeks = payload.gameweeks;
        state.fixtures = payload.fixtures;
        state.teams = payload.teams;
        state.players = payload.players;
        return state
    })
  }
});

export const { setPremiership } = slice.actions;

export default slice.reducer;
