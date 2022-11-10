import { User } from './user.interface';

interface Store {
  id: number;
  url: string;
  name: string;
  wallet: string;
  description: string;
  apiKey: string;
  blocked: boolean;
  user: User;
}

export type { Store };
