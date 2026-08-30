export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  E_WALLET = 'E_WALLET',
}

interface BasePaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface CodPaymentInfo extends BasePaymentInfo {
  method: PaymentMethod.COD;
}

export interface CardPaymentInfo extends BasePaymentInfo {
  method: PaymentMethod.CREDIT_CARD;
  cardLast4: string;
}

export interface TransferPaymentInfo extends BasePaymentInfo {
  method: PaymentMethod.BANK_TRANSFER;
  bankName: string;
  transactionRef: string;
}

export interface EWalletPaymentInfo extends BasePaymentInfo {
  method: PaymentMethod.E_WALLET;
  walletProvider: string;
}

export type PaymentInfo =
  | CodPaymentInfo
  | CardPaymentInfo
  | TransferPaymentInfo
  | EWalletPaymentInfo;

export function isCardPayment(payment: PaymentInfo): payment is CardPaymentInfo {
  return payment.method === PaymentMethod.CREDIT_CARD;
}