import type {
    CreateSpaceFormData,
    Space,
    SpaceState,
    UpdateSpaceFormData,
} from '@/features/space/space.type'
import { protectedApi } from '@/services/api.service'
import { extractErrorMessage } from '@/utils/errors'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

// ============================================================
// Async Thunks
// ============================================================

interface CreateSpaceApiResponse {
  space: Space
  message: string
}

interface GetSpacesApiResponse {
  spaces: Space[]
  count: number
}

export const createSpace = createAsyncThunk<Space, CreateSpaceFormData, { rejectValue: string }>(
  'space/createSpace',
  async (body, { rejectWithValue }) => {
    try {
      const response = await protectedApi.createSpace(body.name, body.description)
      return (response.data as CreateSpaceApiResponse).space
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
      return (response.data as GetSpacesApiResponse).spaces ?? []
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to fetch spaces'))
    }
  }
)

export const fetchSpace = createAsyncThunk<Space, number, { rejectValue: string }>(
  'space/fetchSpace',
  async (spaceId, { rejectWithValue }) => {
    try {
      const response = await protectedApi.getSpace(spaceId)
      return response.data as Space
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load space'))
    }
  }
)

export const updateSpace = createAsyncThunk<
  Space,
  { spaceId: number; data: UpdateSpaceFormData },
  { rejectValue: string }
>('space/updateSpace', async ({ spaceId, data }, { rejectWithValue }) => {
  try {
    const response = await protectedApi.updateSpace(spaceId, data)
    return response.data as Space
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Failed to update space'))
  }
})

export const deleteSpace = createAsyncThunk<number, number, { rejectValue: string }>(
  'space/deleteSpace',
  async (spaceId, { rejectWithValue }) => {
    try {
      await protectedApi.deleteSpace(spaceId)
      return spaceId
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to delete space'))
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

      // Fetch single space
      .addCase(fetchSpace.fulfilled, (state, action) => {
        state.currentSpace = action.payload
      })

      // Update Space
      .addCase(updateSpace.fulfilled, (state, action) => {
        const index = state.spaces.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.spaces[index] = { ...state.spaces[index], ...action.payload }
        }
        if (state.currentSpace?.id === action.payload.id) {
          state.currentSpace = { ...state.currentSpace, ...action.payload }
        }
      })
      .addCase(updateSpace.rejected, (state, action) => {
        state.error = action.payload as string
      })

      // Delete Space
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.spaces = state.spaces.filter((s) => s.id !== action.payload)
        if (state.currentSpace?.id === action.payload) {
          state.currentSpace = null
        }
      })
      .addCase(deleteSpace.rejected, (state, action) => {
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
