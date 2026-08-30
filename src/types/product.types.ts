import { HasId } from './common.types';

export enum Currency {
  VND = 'VND',
  USD = 'USD',
}

export interface Product extends HasId {
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  stockQuantity: number;
  isActive: boolean;
}

export type CreateProductDto = Omit<Product, 'id'>;

export type UpdateProductDto = Partial<Omit<Product, 'id' | 'sku'>>;

export type ProductSummaryDto = Pick<Product, 'id' | 'name' | 'price' | 'currency'>;