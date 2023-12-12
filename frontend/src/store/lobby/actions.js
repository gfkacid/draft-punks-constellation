import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "utils/api";

export const getTournaments = createAsyncThunk(
  "GET_TOURNAMENTS",
  async (params, { rejectWithValue }) => {
    try {
      const res = await get("/lobby", params);

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const getTournamentInfo = createAsyncThunk(
    "GET_TOURNAMENT_INFO",
    async (params, { rejectWithValue }) => {
      try {
        const res = await get("/tournament-info/", params);
        return res.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );