import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async Thunks
export const logAnalyticsEvent = createAsyncThunk('analytics/log', async (eventData, { rejectWithValue }) => {
    try {
        // Option 1: Basic Geolocation (Browser API)
        // Note: Users must allow this permission.
        let location = null;
        try {
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
                });
                location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            }
        } catch (geoError) {
            // Permission denied or timeout - ignore
            // console.warn("Geolocation skipped:", geoError);
        }

        // eventData with location
        const payload = { ...eventData, location };

        await api.post('/analytics/log', payload);
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
