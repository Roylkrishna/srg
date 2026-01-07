import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchBanners = createAsyncThunk('banners/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/banners');
        return response.data.banners;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const addBanner = createAsyncThunk('banners/add', async (formData, thunkAPI) => {
    try {
        const response = await api.post('/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.banner;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteBanner = createAsyncThunk('banners/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/banners/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const bannerSlice = createSlice({
    name: 'banners',
    initialState: {
        banners: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.banners.push(action.payload);
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter(b => b._id !== action.payload);
            });
    }
});

export default bannerSlice.reducer;
