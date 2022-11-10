import { Store } from './store.interface';

interface Payment {
  id: number;
  datetime: string;
  amount: string;
  status: string;
  comment: string;
  type: number | null;
  text: string | null;
  cancelled: boolean;
  store: Store;
}

export type { Payment };
