import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import bannerReducer from './slices/bannerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        user: userReducer,
        categories: categoryReducer,
        banners: bannerReducer,
    },
});
