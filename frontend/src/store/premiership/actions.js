import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "utils/api";

export const getPremiershipData = createAsyncThunk(
  "GET_PREMIERSHIP_DATA",
  async (params, { rejectWithValue }) => {
    try {
      const res = await get("/premiership-data", params);

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

