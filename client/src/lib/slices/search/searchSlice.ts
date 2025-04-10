import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "./types";

const initialState: SearchState = {
  recentSearches: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.recentSearches = [
        query,
        ...state.recentSearches.filter((q) => q !== query), // avoid duplicate
      ].slice(0, 8);
    },
    removeSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.recentSearches = state.recentSearches.filter((q) => q !== query);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const { addSearch, clearRecentSearches, removeSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
