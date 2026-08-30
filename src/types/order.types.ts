import { HasId, Nullable } from './common.types';
import { CustomerSummaryDto } from './customer.types';
import { PaymentInfo } from './payment.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export type CreateOrderItemDto = Pick<OrderItem, 'productId' | 'quantity'>;

export interface Order extends HasId {
  orderCode: string;
  customer: CustomerSummaryDto;
  items: OrderItem[];
  status: OrderStatus;
  payment: PaymentInfo;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerId: string;
  items: CreateOrderItemDto[];
  payment: Pick<PaymentInfo, 'method'>;
  note?: string;
}

export type UpdateOrderStatusDto = Pick<Order, 'status'> & Nullable<Pick<Order, 'note'>>;

export type OrderListItemDto = Omit<Order, 'items' | 'payment'> & {
  itemCount: number;
};