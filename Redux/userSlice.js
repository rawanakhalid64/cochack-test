
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/api/v1/users/me");
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoading: false,
    error: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;