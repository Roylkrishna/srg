import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchAllCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/categories/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetCategoryState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch categories';
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create category';
            })
            // Delete
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => (c._id || c.id) !== action.payload);
            });
    }
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
