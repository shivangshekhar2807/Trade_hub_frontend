import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
  name: "refresh",
  initialState: null as number | null,
  reducers: {
    setRefresh: (state) => {
      return Math.random();
    },
  },
});

export const { setRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;