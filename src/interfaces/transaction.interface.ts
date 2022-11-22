import { Payment } from './payment.interface';

interface Transaction {
  id: number;
  status: string;
  email: string;
  updated: string;
  txHash: string;
  sender: string;
  amount: string;
  payment: Payment;
  receiver: string;
  walletForTransaction: null | string;
}

export type { Transaction };
