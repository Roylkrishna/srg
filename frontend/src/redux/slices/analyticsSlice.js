import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async Thunks
export const logAnalyticsEvent = createAsyncThunk('analytics/log', async (eventData, { rejectWithValue }) => {
    try {
        // eventData: { eventType, productId, metadata }
        await api.post('/analytics/log', eventData);
    } catch (error) {
        // Silent failure for analytics logging
        return rejectWithValue(error.response?.data?.message || 'Logging failed');
    }
});

export const fetchAnalyticsDashboard = createAsyncThunk('analytics/fetchDashboard', async (timeRange = '7d', { rejectWithValue }) => {
    try {
        const response = await api.get(`/analytics/dashboard?timeRange=${timeRange}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
});

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        dashboardData: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalyticsDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchAnalyticsDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default analyticsSlice.reducer;
