import type { LoginCredentials, AuthResponse, AuthUser, AuthError } from '../types/auth';

/**
 * AuthService - Isolates all authentication backend calls
 * This allows seamless swapping between mock and Supabase authentication
 * without modifying the presentation layer
 */

const MOCK_DELAY_MS = 1500;

const MOCK_ADMIN_USER: AuthUser = {
  id: 'admin-001',
  email: 'admin@recycle.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
};

const MOCK_TOKEN = 'mock-jwt-token-' + Date.now();

/**
 * Simulates authentication against a backend API
 * In production, this would make actual HTTP calls to Supabase or your auth provider
 */
async function authenticateWithBackend(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const { email, password } = credentials;

  if (email === 'admin@recycle.com' && password === 'admin123') {
    return {
      user: MOCK_ADMIN_USER,
      token: MOCK_TOKEN,
    };
  }

  const error: AuthError = {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password. Please try again.',
  };
  throw error;
}

/**
 * Public API for authentication operations
 * This abstraction allows the UI to remain unchanged when switching auth providers
 */
export const authService = {
  /**
   * Authenticates a user with email and password
   * @param credentials - User login credentials
   * @returns AuthResponse with user data and token
   * @throws AuthError on authentication failure
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return authenticateWithBackend(credentials);
  },

  /**
   * Validates if a token is still valid
   * @param token - JWT token to validate
   * @returns boolean indicating token validity
   */
  async validateToken(token: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return token.startsWith('mock-jwt-token-') || token.startsWith('eyJ');
  },

  /**
   * Retrieves user information from a token
   * @param token - JWT token
   * @returns User data if token is valid
   */
  async getUserFromToken(token: string): Promise<AuthUser | null> {
    const isValid = await this.validateToken(token);
    if (!isValid) return null;
    
    return MOCK_ADMIN_USER;
  },

  /**
   * Logs out the current user (clears session)
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};

/**
 * Supabase authentication placeholder
 * Uncomment and configure when ready to switch to Supabase:
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export async function loginWithSupabase(credentials: LoginCredentials) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: credentials.email,
//     password: credentials.password,
//   });

//   if (error) throw { code: error.name, message: error.message };

//   return {
//     user: data.user!,
//     token: data.session!.access_token,
//   };
// }