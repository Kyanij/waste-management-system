export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export type AuthProviderType = 'supabase' | 'mock';

export interface AuthConfig {
  provider: AuthProviderType;
 supabaseUrl?: string;
  supabaseAnonKey?: string;
}