import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Add other auth methods as needed
}

// Extend the Window interface to include any global variables
declare global {
  interface Window {
    // Add any global variables here if needed
  }
}
