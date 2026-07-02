import { protectedApi } from "@/services/api.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

/**
 * User info for shared spaces
 */
export interface SharedUser {
  id: number;
  name: string;
  email: string;
}

/**
 * Response when sharing a space
 */
export interface ShareSpaceResponse {
  message: string;
}

/**
 * Shared space state
 */
export interface SharedSpaceState {
  loading: boolean;
  error: string | null;
  sharedUsers: SharedUser[];
  success: boolean;
}

// ============================================================
// Error extraction helper
// ============================================================

const extractErrorMessage = (err: unknown, fallbackMessage: string): string => {
  if (err instanceof AxiosError) {
    const backendMessage = err.response?.data as { message?: string; detail?: string } | undefined;
    if (backendMessage?.message) {
      return backendMessage.message;
    }
    if (backendMessage?.detail) {
      return backendMessage.detail;
    }
    if (err.message) {
      return err.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallbackMessage;
};

// ============================================================
// Async Thunks
// ============================================================

export const shareSpace = createAsyncThunk<
  ShareSpaceResponse,
  { spaceId: number; userEmail: string,permission:string },
  { rejectValue: string }
>("sharedSpace/shareSpace", async ({ spaceId, userEmail,permission }, { rejectWithValue }) => {
  try {
    const response = await protectedApi.shareSpace(spaceId, userEmail,permission);
    return response.data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, "Failed to share space"));
  }
});

export const getSharedUsers = createAsyncThunk<
  SharedUser[],
  number,
  { rejectValue: string }
>("sharedSpace/getSharedUsers", async (spaceId, { rejectWithValue }) => {
  try {
    const response = await protectedApi.getSharedUsers(spaceId);
    return response.data;
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, "Failed to fetch shared users")
    );
  }
});

// ============================================================
// Initial State
// ============================================================

const initialState: SharedSpaceState = {
  loading: false,
  error: null,
  sharedUsers: [],
  success: false,
};

// ============================================================
// Slice
// ============================================================

const sharedSpaceSlice = createSlice({
  name: "sharedSpace",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetSharedSpace: (state) => {
      state.loading = false;
      state.error = null;
      state.sharedUsers = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Share Space
      .addCase(shareSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(shareSpace.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(shareSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Get Shared Users
      .addCase(getSharedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSharedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedUsers = action.payload;
        state.error = null;
      })
      .addCase(getSharedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.sharedUsers = [];
      });
  },
});

// ============================================================
// Selectors
// ============================================================

export const selectSharedSpaceLoading = (state: { sharedSpace: SharedSpaceState }) =>
  state.sharedSpace.loading;

export const selectSharedSpaceError = (state: { sharedSpace: SharedSpaceState }) =>
  state.sharedSpace.error;

export const selectSharedUsers = (state: { sharedSpace: SharedSpaceState }) =>
  state.sharedSpace.sharedUsers;

export const selectShareSuccess = (state: { sharedSpace: SharedSpaceState }) =>
  state.sharedSpace.success;

export const { clearError, clearSuccess, resetSharedSpace } =
  sharedSpaceSlice.actions;

export default sharedSpaceSlice.reducer;