import { Currency, type Product } from '@/types/product.types';
export const product: Product = {
  id: 'p1', sku: 'SKU-1', name: 'Áo thun', description: 'Áo cotton',
  price: 100000, currency: Currency.VND, stockQuantity: 3, isActive: true,
};
