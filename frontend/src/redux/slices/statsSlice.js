import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchStats = createAsyncThunk('stats/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
});

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        stats: {
            patrons: 0,
            curations: 0,
            categories: 0,
            orders: 0
        },
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default statsSlice.reducer;
