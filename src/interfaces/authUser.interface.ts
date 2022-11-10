import { UserRole } from '../modules/user/enums/userRole.enum';

interface AuthUser {
  id: number;
  name: string;
  lastName: string;
  company: string;
  email: string;
  token: string;
  resetEnabled: boolean;
  role: UserRole;
}

export type { AuthUser };
