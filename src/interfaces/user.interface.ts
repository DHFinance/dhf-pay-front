interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  blocked: boolean;
  loginAttempts: number;
  timeBlockLogin: any;
}

export type { User };
