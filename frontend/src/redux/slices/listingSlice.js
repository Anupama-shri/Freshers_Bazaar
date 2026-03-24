import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listings: [],
  currentListing: null,
  userListings: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  },
};

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setListings: (state, action) => {
      state.listings = action.payload;
      state.loading = false;
    },
    setCurrentListing: (state, action) => {
      state.currentListing = action.payload;
      state.loading = false;
    },
    setUserListings: (state, action) => {
      state.userListings = action.payload;
      state.loading = false;
    },
    addListing: (state, action) => {
      state.listings.unshift(action.payload);
    },
    updateListing: (state, action) => {
      const index = state.listings.findIndex(
        (l) => l._id === action.payload._id,
      );
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
    },
    deleteListing: (state, action) => {
      state.listings = state.listings.filter((l) => l._id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setListings,
  setCurrentListing,
  setUserListings,
  addListing,
  updateListing,
  deleteListing,
  setFilters,
  setError,
} = listingSlice.actions;
export default listingSlice.reducer;
