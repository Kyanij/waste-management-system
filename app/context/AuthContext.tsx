import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthContextType, AuthUser, AuthError, LoginCredentials } from '../types/auth';
import { authService } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'recycle_auth';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const { token } = JSON.parse(storedAuth);
        authService.validateToken(token).then((isValid) => {
          if (isValid) {
            authService.getUserFromToken(token).then((userData) => {
              if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
              }
            });
          }
          setIsLoading(false);
        });
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      if (credentials.rememberMe) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: response.token, user: response.user })
        );
      }
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}