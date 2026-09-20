import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload;
      if (!product.isActive || product.stockQuantity < 1) return;
      const item = state.items.find(({ product: saved }) => saved.id === product.id);
      if (item) {
        item.quantity = Math.min(item.quantity + 1, product.stockQuantity);
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(({ product }) => product.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(({ product }) => product.id === productId);
      if (!item || !Number.isInteger(quantity)) return;
      if (quantity <= 0) {
        state.items = state.items.filter(({ product }) => product.id !== productId);
      } else {
        item.quantity = Math.min(quantity, item.product.stockQuantity);
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
