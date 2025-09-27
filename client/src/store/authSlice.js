import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // Add this to track initial auth check
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.isInitializing = false; // Auth check complete
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.isInitializing = false; // Auth check complete
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      state.isInitializing = false; // Auth check complete, no stored auth found
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearError,
  initializeAuth
} = authSlice.actions;

export default authSlice.reducer;
