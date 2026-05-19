import type {
    CreateSpaceFormData,
    Space,
    SpaceState,
} from '@/features/space/space.type'
import { protectedApi } from '@/services/api.service'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

// ============================================================
// Async Thunks
// ============================================================

const extractErrorMessage = (err: unknown, fallbackMessage: string): string => {
  if (err instanceof AxiosError) {
    const backendMessage = (err.response?.data as { message?: string; detail?: string } | undefined)
    if (backendMessage?.message) {
      return backendMessage.message
    }
    if (backendMessage?.detail) {
      return backendMessage.detail
    }
    if (err.message) {
      return err.message
    }
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallbackMessage
}

export const createSpace = createAsyncThunk<Space, CreateSpaceFormData, { rejectValue: string }>(
  'space/createSpace',
  async (body, { rejectWithValue }) => {
    try {
      const response = await protectedApi.createSpace(body.name, body.description)
      // Handle response - space might be directly in response.data or in response.data.space
      const space = (response.data as any).space || response.data
      return space
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to create space'))
    }
  }
)

export const fetchSpaces = createAsyncThunk<Space[], void, { rejectValue: string }>(
  'space/fetchSpaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await protectedApi.getSpaces()
      // Handle response - spaces might be directly in response.data or in response.data.spaces
      const spaces = (response.data as any).spaces || response.data
      return Array.isArray(spaces) ? spaces : []
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to fetch spaces'))
    }
  }
)

// ============================================================
// Initial State
// ============================================================

const initialState: SpaceState = {
  spaces: [],
  currentSpace: null,
  loading: false,
  error: null,
  isCreateModalOpen: false,
}

// ============================================================
// Slice
// ============================================================

const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false
    },
    clearError: (state) => {
      state.error = null
    },
    setCurrentSpace: (state, action: PayloadAction<Space | null>) => {
      state.currentSpace = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Space
      .addCase(createSpace.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSpace.fulfilled, (state, action) => {
        state.loading = false
        state.spaces.push(action.payload)
        state.isCreateModalOpen = false
        state.error = null
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Spaces
      .addCase(fetchSpaces.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.loading = false
        state.spaces = action.payload
        state.error = null
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

// ============================================================
// Selectors
// ============================================================

export const selectSpaces = (state: { space: SpaceState }) => state.space.spaces

export const selectCurrentSpace = (state: { space: SpaceState }) => state.space.currentSpace

export const selectSpaceLoading = (state: { space: SpaceState }) => state.space.loading

export const selectSpaceError = (state: { space: SpaceState }) => state.space.error

export const selectIsCreateModalOpen = (state: { space: SpaceState }) => state.space.isCreateModalOpen

// ============================================================
// Actions
// ============================================================

export const { openCreateModal, closeCreateModal, clearError, setCurrentSpace } = spaceSlice.actions

export default spaceSlice.reducer
