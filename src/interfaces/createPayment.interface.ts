import { CurrencyType } from '../enums/currency.enum';

interface CreatePayment {
  amount: string;
  comment: string;
  currency: CurrencyType;
}

export type { CreatePayment };
