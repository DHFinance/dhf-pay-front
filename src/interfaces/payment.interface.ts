import { CurrencyType } from '../enums/currency.enum';
import { Store } from './store.interface';

interface Payment {
  id: number;
  datetime: string;
  amount: string;
  status: string;
  comment: string;
  currency: CurrencyType;
  type: number | null;
  text: string | null;
  cancelled: boolean;
  store: Store;
  url: string;
}

export type { Payment };
