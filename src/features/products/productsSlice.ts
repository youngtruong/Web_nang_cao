import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '@/types/product.types';

type ProductsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
}

const initialState: ProductsState = { items: [], status: 'idle', error: null };

export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchAll',
  async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}api/products.json`);
    if (!response.ok) throw new Error(`Không tải được sản phẩm (${response.status})`);
    return (await response.json()) as Product[];
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Không tải được sản phẩm.';
      });
  },
});

export default productsSlice.reducer;
