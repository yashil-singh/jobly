import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./types";
import { SocialLink } from "@/services/users/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    updateSocialLink: (state, action: PayloadAction<SocialLink[]>) => {
      if (state.user) {
        state.user.socialLinks = action.payload;
      }
    },
    detachSocialLink: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.socialLinks = state.user.socialLinks.filter(
          (link) => link.label !== action.payload,
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  updateSocialLink,
  detachSocialLink,
} = authSlice.actions;
export default authSlice.reducer;
