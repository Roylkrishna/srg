import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Fetch Contact Info
export const fetchContact = createAsyncThunk('contact/fetchContact', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/contact');
        return response.data.contact;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact details');
    }
});

// Update Contact Info (Owner Only)
export const updateContact = createAsyncThunk('contact/updateContact', async (updates, { rejectWithValue }) => {
    try {
        const response = await api.put('/contact', updates);
        return response.data.contact;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update contact details');
    }
});

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        info: null,
        loading: false,
        error: null,
        updateSuccess: false
    },
    reducers: {
        resetUpdateSuccess: (state) => {
            state.updateSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContact.fulfilled, (state, action) => {
                state.loading = false;
                state.info = action.payload;
            })
            .addCase(fetchContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateContact.fulfilled, (state, action) => {
                state.info = action.payload;
                state.updateSuccess = true;
            });
    }
});

export const { resetUpdateSuccess } = contactSlice.actions;
export default contactSlice.reducer;
