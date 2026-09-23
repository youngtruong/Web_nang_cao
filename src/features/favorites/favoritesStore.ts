import { create } from 'zustand';
import type { Product } from '@/types/product.types';

interface FavoritesState {
  items: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  items: [],
  addFavorite: (product) =>
    set((state) =>
      state.items.some((item) => item.id === product.id)
        ? state
        : { items: [...state.items, product] },
    ),
  removeFavorite: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  toggleFavorite: (product) =>
    set((state) => ({
      items: state.items.some((item) => item.id === product.id)
        ? state.items.filter((item) => item.id !== product.id)
        : [...state.items, product],
    })),
}));
