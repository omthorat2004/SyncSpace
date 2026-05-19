import { protectedApi } from "@/services/api.service";
import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import {type Content,type ContentType } from "./content.type";

export interface ContentState {
    contents: Content[];
    currentContent: Content | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ContentState = {
    contents: [],
    currentContent: null,
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const fetchContents = createAsyncThunk(
    "content/fetchContents",
    async (
        { spaceId, type }: { spaceId: number; type?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await protectedApi.getContents(spaceId, type);
            return response.data.contents;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch contents"
            );
        }
    }
);

export const fetchContent = createAsyncThunk(
    "content/fetchContent",
    async (
        { spaceId, contentId }: { spaceId: number; contentId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await protectedApi.getContent(spaceId, contentId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch content"
            );
        }
    }
);

export const createContent = createAsyncThunk(
    "content/createContent",
    async (
        {
            spaceId,
            title,
            type,
            content,
            url,
        }: {
            spaceId: number;
            title: string;
            type: ContentType;
            content: string;
            url?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await protectedApi.createContent(spaceId, {
                title,
                type,
                content,
                url,
            });
            return response.data.content;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create content"
            );
        }
    }
);

export const updateContent = createAsyncThunk(
    "content/updateContent",
    async (
        {
            spaceId,
            contentId,
            title,
            content,
            url,
        }: {
            spaceId: number;
            contentId: number;
            title?: string;
            content?: string;
            url?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await protectedApi.updateContent(spaceId, contentId, {
                title,
                content,
                url,
            });
            return response.data.content;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update content"
            );
        }
    }
);

export const deleteContent = createAsyncThunk(
    "content/deleteContent",
    async (
        { spaceId, contentId }: { spaceId: number; contentId: number },
        { rejectWithValue }
    ) => {
        try {
            await protectedApi.deleteContent(spaceId, contentId);
            return contentId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete content"
            );
        }
    }
);

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearCurrentContent: (state) => {
            state.currentContent = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch contents
        builder
            .addCase(fetchContents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchContents.fulfilled,
                (state, action: PayloadAction<Content[]>) => {
                    state.loading = false;
                    state.contents = action.payload;
                    state.error = null;
                }
            )
            .addCase(fetchContents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch single content
        builder
            .addCase(fetchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchContent.fulfilled,
                (state, action: PayloadAction<Content>) => {
                    state.loading = false;
                    state.currentContent = action.payload;
                    state.error = null;
                }
            )
            .addCase(fetchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create content
        builder
            .addCase(createContent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(
                createContent.fulfilled,
                (state, action: PayloadAction<Content>) => {
                    state.loading = false;
                    state.contents.unshift(action.payload);
                    state.success = true;
                    state.error = null;
                }
            )
            .addCase(createContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });

        // Update content
        builder
            .addCase(updateContent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(
                updateContent.fulfilled,
                (state, action: PayloadAction<Content>) => {
                    state.loading = false;
                    const index = state.contents.findIndex(
                        (c) => c.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.contents[index] = action.payload;
                    }
                    if (state.currentContent?.id === action.payload.id) {
                        state.currentContent = action.payload;
                    }
                    state.success = true;
                    state.error = null;
                }
            )
            .addCase(updateContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });

        // Delete content
        builder
            .addCase(deleteContent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(
                deleteContent.fulfilled,
                (state, action: PayloadAction<number>) => {
                    state.loading = false;
                    state.contents = state.contents.filter(
                        (c) => c.id !== action.payload
                    );
                    if (state.currentContent?.id === action.payload) {
                        state.currentContent = null;
                    }
                    state.success = true;
                    state.error = null;
                }
            )
            .addCase(deleteContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess, clearCurrentContent } =
    contentSlice.actions;
export default contentSlice.reducer;
