import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async Thunks
export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, thunkAPI) => {
    try {
        // params can be an object like { select: 'name,price' }
        // axios accepts 'params' in config
        const response = await api.get('/products', { params });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchProductDetails = createAsyncThunk('products/fetchDetails', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/products/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const searchProducts = createAsyncThunk('products/search', async (query, thunkAPI) => {
    try {
        const response = await api.get('/products', { params: { search: query, select: 'name,price,image,images,category' } });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const recordSale = createAsyncThunk('products/recordSale', async (saleData, thunkAPI) => {
    try {
        const response = await api.post('/products/record-sale', saleData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchSalesHistory = createAsyncThunk('products/fetchSalesHistory', async (_, thunkAPI) => {
    try {
        const response = await api.get('/products/sales/history');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        searchResults: [],
        productDetails: null,
        salesHistory: [],
        loading: false,
        searchLoading: false,
        error: null,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.productDetails = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetails = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.productDetails && state.productDetails._id === action.payload._id) {
                    state.productDetails = action.payload;
                }
            })
            // Search
            .addCase(searchProducts.rejected, (state) => {
                state.searchLoading = false;
            })
            // Record Sale
            .addCase(recordSale.fulfilled, (state, action) => {
                const updatedProduct = action.payload.updatedProduct;
                const index = state.items.findIndex(item => item._id === updatedProduct._id);
                if (index !== -1) {
                    state.items[index] = updatedProduct;
                }
                state.salesHistory.unshift(action.payload.sale);
            })
            // Fetch Sales History
            .addCase(fetchSalesHistory.fulfilled, (state, action) => {
                state.salesHistory = action.payload;
            });
    }
});

export const { clearSearchResults } = productSlice.actions;

export default productSlice.reducer;
