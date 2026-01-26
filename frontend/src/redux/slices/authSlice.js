import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Initial State
const initialState = {
    user: null,
    loading: false,
    isAuthChecked: false,
    error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        // Ensure credentials (cookies) are sent/received
        const response = await api.post('/auth/login', userData);
        return response.data.user;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/check');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (identifier, thunkAPI) => {
    try {
        const response = await api.post('/auth/forgot-password', { identifier });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, thunkAPI) => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Auth (Session Persistence)
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthChecked = true;
                if (action.payload.isAuthenticated) {
                    state.user = action.payload.user;
                } else {
                    state.user = null;
                }
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.isAuthChecked = true;
                state.user = null;
            })
            // Logout User
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                // Trigger storage event for other tabs
                localStorage.setItem('logout', Date.now().toString());
            })
            .addCase(logoutUser.rejected, (state) => {
                // Even if it fails, we clear state for security
                state.user = null;
                localStorage.setItem('logout', Date.now().toString());
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
