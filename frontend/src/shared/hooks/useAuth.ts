import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { authUtils } from '@/features/auth/lib/auth';
import type { User } from '@/features/users/model/user.model';
import type { Session } from '@/features/auth/model/auth.model';
import { LoginAdapter } from '@/features/auth/adapter/LoginAdapter';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const adapter = useMemo(() => new LoginAdapter(), []);

  const checkAuth = useCallback(async () => {
    try {
      const tokens = authUtils.getTokens();
      if (!tokens || authUtils.isTokenExpired(tokens)) {
        authUtils.removeTokens();
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      const sessionData = await adapter.getSession();
      if (sessionData?.user) {
        setUser(sessionData.user);
        setSession({
          id: 'current-session',
          expAt: tokens.expAt,
          isActive: true
        });
      } else {
        authUtils.removeTokens();
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authUtils.removeTokens();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    try {
      const result = await adapter.login({ username, password });
      setUser({ id: result.user.id, username: result.user.username });
      setSession({
        id: result.session.id,
        expAt: result.session.expAt,
        isActive: result.session.isActive
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adapter.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSession(null);
      authUtils.removeTokens();
      router.push('/login');
    }
  };

  const isAuthenticated = !!user && !!session && !loading;

  return {
    user,
    session,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};
