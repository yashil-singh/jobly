import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job, UserJobState } from "./types";

const initialState: UserJobState = {
  saves: [],
  applications: [],
};

const jobSlice = createSlice({
  name: "userJobs",
  initialState,
  reducers: {
    // save related reducers
    setSaved: (state, action: PayloadAction<Job[]>) => {
      state.saves = action.payload;
    },
    saveJob: (state, action: PayloadAction<Job>) => {
      state.saves = [...state.saves, action.payload];
    },
    removeSavedJob: (state, action: PayloadAction<Job>) => {
      state.saves = state.saves.filter((save) => save.id !== action.payload.id);
    },

    // application related reducers
    setApplications: (state, action: PayloadAction<Job[]>) => {
      state.applications = action.payload;
    },
    addApplication: (state, action: PayloadAction<Job>) => {
      state.applications = [...state.applications, action.payload];
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(
        (job) => job.id !== action.payload,
      );
    },
  },
});

export const {
  setSaved,
  saveJob,
  removeSavedJob,
  setApplications,
  addApplication,
  removeApplication,
} = jobSlice.actions;
export default jobSlice.reducer;
