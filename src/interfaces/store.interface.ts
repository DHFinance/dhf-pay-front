import { User } from './user.interface';
import { Wallet } from './wallet.interface';

interface Store {
  id: number;
  url: string;
  name: string;
  wallets: Wallet[];
  description: string;
  apiKey: string;
  blocked: boolean;
  user: User;
}

export type { Store };
