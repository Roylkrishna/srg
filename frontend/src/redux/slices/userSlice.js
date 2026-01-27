import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const updateUserProfile = createAsyncThunk('user/updateProfile', async ({ id, data }, thunkAPI) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchWishlist = createAsyncThunk('user/fetchWishlist', async (_, thunkAPI) => {
    try {
        const response = await api.get('/users/wishlist');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async (_, thunkAPI) => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchUserWithOrders = createAsyncThunk('user/fetchWithOrders', async (id, thunkAPI) => {
    try {
        // Changed to use 'api' and added withCredentials as per instruction's example
        const response = await api.get(`/users/details/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateUserRole = createAsyncThunk('user/updateUserRole', async ({ id, role }, thunkAPI) => {
    try {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createUser = createAsyncThunk('user/create', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteUser = createAsyncThunk('user/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/users/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const toggleUserStatus = createAsyncThunk('user/toggleStatus', async (id, thunkAPI) => {
    try {
        const response = await api.patch(`/users/${id}/status`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchManagerActivity = createAsyncThunk('user/fetchActivity', async ({ id, startDate, endDate }, thunkAPI) => {
    try {
        let url = `/users/activity/${id}`; // Adapted to use '/users' prefix consistent with other API calls
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await api.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const toggleWishlistProduct = createAsyncThunk('user/toggleWishlist', async (productId, thunkAPI) => {
    try {
        const response = await api.put('/users/wishlist/toggle', { productId });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const adminResetPassword = createAsyncThunk('user/adminResetPassword', async ({ userId, newPassword }, thunkAPI) => {
    try {
        const response = await api.put('/users/admin-reset-password', { userId, newPassword });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchManagersStats = createAsyncThunk('user/fetchManagersStats', async ({ startDate, endDate }, thunkAPI) => {
    try {
        let url = '/users/managers-stats';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await api.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const changePassword = createAsyncThunk('user/changePassword', async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
        const response = await api.put('/users/change-password', { oldPassword, newPassword });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null, // Kept for general user profile
        wishlist: [],
        users: [],
        currentUserDetails: null, // For single user details with orders (as per instruction's example)
        activities: [], // For manager work done (as per instruction)
        managersStats: [], // New for manager activity overview
        managersStatsLoading: false,
        loading: false,
        activityLoading: false, // Added as per instruction
        error: null,
        success: false
    },
    reducers: {
        resetUpdateSuccess: (state) => {
            state.success = false;
        },
        clearUserDetails: (state) => {
            state.currentUserDetails = null;
            state.activities = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.profile = { ...state.profile, ...action.payload.user };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update User Role
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Create User
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            // Toggle Status
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.currentUserDetails && state.currentUserDetails._id === action.payload._id) {
                    state.currentUserDetails = { ...state.currentUserDetails, ...action.payload };
                }
                if (state.profile && state.profile._id === action.payload._id) {
                    state.profile = { ...state.profile, ...action.payload };
                }
            })
            // Fetch With Orders
            .addCase(fetchUserWithOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserWithOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUserDetails = action.payload;
            })
            .addCase(fetchUserWithOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Manager Activity
            .addCase(fetchManagerActivity.pending, (state) => {
                state.activityLoading = true;
            })
            .addCase(fetchManagerActivity.fulfilled, (state, action) => {
                state.activityLoading = false;
                state.activities = action.payload;
            })
            .addCase(fetchManagerActivity.rejected, (state, action) => {
                state.activityLoading = false;
                state.error = action.payload;
            })
            // Managers Stats
            .addCase(fetchManagersStats.pending, (state) => {
                state.managersStatsLoading = true;
            })
            .addCase(fetchManagersStats.fulfilled, (state, action) => {
                state.managersStatsLoading = false;
                state.managersStats = action.payload;
            })
            .addCase(fetchManagersStats.rejected, (state, action) => {
                state.managersStatsLoading = false;
                state.error = action.payload;
            })
            // Toggle Wishlist
            .addCase(toggleWishlistProduct.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.likedProducts = action.payload.wishlist;
                }
                // Also update user in auth state if needed, but usually auth state is synced or we rely on user state for details
            });
    }
});

export const { resetUpdateSuccess, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
