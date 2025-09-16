// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import * as Keychain from 'react-native-keychain';
import { oidc } from '../auth/config';

type AuthTokens = {
  accessToken: string;
  accessTokenExpirationDate?: string;
  refreshToken?: string;
  idToken?: string;
};

type AuthContextType = {
  tokens: AuthTokens | null;
  login: (opts?: { register?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ——— mały helper: usuwa null/undefined z obiektu (płasko) ———
const prune = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as T;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  (async () => {
    try {
      // jeśli zapisywałeś z 'service', podaj ten sam tutaj
      const creds = await Keychain.getGenericPassword({ service: 'auth' });

      // zawężenie: 'creds' może być false albo UserCredentials
      if (creds && typeof creds !== 'boolean') {
        setTokens(JSON.parse(creds.password));
      }
    } catch (e) {
      console.warn('AuthContext init error', e);
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const login = async (opts?: { register?: boolean }) => {
    // zbuduj additionalParameters tylko gdy potrzeba
    const additionalParameters = opts?.register ? { kc_action: 'register' } : undefined;

    // wyczyść config z null/undefined (również additionalParameters)
    const cfg = prune({ ...oidc, additionalParameters: additionalParameters && prune(additionalParameters) });

    // DOBRZE widzieć co faktycznie wysyłamy:
    console.log('[Auth] authorize() with cfg:', cfg);

    try {
      const result = await authorize(cfg);

      const newTokens: AuthTokens = {
        accessToken: result.accessToken,
        accessTokenExpirationDate: result.accessTokenExpirationDate,
        refreshToken: result.refreshToken,
        idToken: result.idToken,
      };

      setTokens(newTokens);
      await Keychain.setGenericPassword('auth', JSON.stringify(newTokens), {
  service: 'auth',
});
    } catch (e) {
      console.error('[Auth] authorize() failed:', e);
      throw e; // pozwól UI pokazać błąd
    }
  };

  const refreshTokens = async () => {
    if (!tokens?.refreshToken) return;

    try {
      const cfg = prune({ ...oidc }); // na wszelki wypadek też czyścimy
      console.log('[Auth] refresh() with cfg:', cfg);

      const res = await refresh(cfg, { refreshToken: tokens.refreshToken });
      const newTokens: AuthTokens = {
        accessToken: res.accessToken,
        accessTokenExpirationDate: res.accessTokenExpirationDate,
        refreshToken: res.refreshToken ?? tokens.refreshToken,
        idToken: res.idToken ?? tokens.idToken,
      };

      setTokens(newTokens);
      await Keychain.setGenericPassword('auth', JSON.stringify(newTokens));
    } catch (e) {
      console.error('[Auth] refresh() failed, logging out:', e);
      await logout();
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        const cfg = prune({ ...oidc });
        await revoke(cfg, { tokenToRevoke: tokens.refreshToken, sendClientId: true });
      }
    } catch (e) {
      console.warn('[Auth] revoke failed:', e);
    } finally {
      setTokens(null);
      await Keychain.resetGenericPassword({ service: 'auth' });
    }
  };

  return (
    <AuthContext.Provider value={{ tokens, login, logout, refreshTokens, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};