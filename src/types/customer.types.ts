import { HasId } from './common.types';

export interface Address {
  street: string;
  ward?: string;
  district: string;
  city: string;
  country: string;
}

export interface Customer extends HasId {
  fullName: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
}

export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt'>;

export type UpdateCustomerDto = Partial<Omit<Customer, 'id' | 'createdAt'>>;

export type CustomerSummaryDto = Pick<Customer, 'id' | 'fullName' | 'phone'>;