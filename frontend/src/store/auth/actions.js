import { createAsyncThunk } from "@reduxjs/toolkit";
import { get , post} from "utils/api";
import { loginUser } from "./slice";

export const userAuth = createAsyncThunk(
  "USER_AUTH",
  async (params, { rejectWithValue, dispatch }) => {
    try {

        const res = await post("/user-auth", params);
        if (res.data?.user) {
            dispatch(loginUser(res.data));
        }
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
  }
);
