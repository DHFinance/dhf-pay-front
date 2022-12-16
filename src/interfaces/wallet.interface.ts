import { CurrencyType } from '../enums/currency.enum';

interface Wallet {
  value: string;
  currency: CurrencyType;
}

export type { Wallet };
