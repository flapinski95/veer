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
import { oidc } from '../auth/config'; // issuer, clientId, redirectUrl itd.

type AuthTokens = {
  accessToken: string;
  accessTokenExpirationDate?: string;
  refreshToken?: string;
  idToken?: string;
};

type AuthContextType = {
  tokens: AuthTokens | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Ładowanie tokenów z Keychain przy starcie
  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword();
        if (creds) {
          setTokens(JSON.parse(creds.password));
        }
      } catch (e) {
        console.warn('AuthContext init error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Login
  const login = async () => {
    const result = await authorize(oidc);
    const newTokens: AuthTokens = {
      accessToken: result.accessToken,
      accessTokenExpirationDate: result.accessTokenExpirationDate,
      refreshToken: result.refreshToken,
      idToken: result.idToken,
    };
    setTokens(newTokens);
    await Keychain.setGenericPassword('auth', JSON.stringify(newTokens));
  };

  // 🔹 Odświeżanie tokena
  const refreshTokens = async () => {
    if (!tokens?.refreshToken) return;
    try {
      const res = await refresh(oidc, { refreshToken: tokens.refreshToken });
      const newTokens: AuthTokens = {
        accessToken: res.accessToken,
        accessTokenExpirationDate: res.accessTokenExpirationDate,
        refreshToken: res.refreshToken ?? tokens.refreshToken,
        idToken: res.idToken ?? tokens.idToken,
      };
      setTokens(newTokens);
      await Keychain.setGenericPassword('auth', JSON.stringify(newTokens));
    } catch (e) {
      console.error('Refresh failed', e);
      await logout(); // ✅ zamiast ręcznego resetu
    }
  };

  // 🔹 Wylogowanie
  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await revoke(oidc, { tokenToRevoke: tokens.refreshToken, sendClientId: true });
      }
    } catch (e) {
      console.warn('Revoke failed', e);
    } finally {
      setTokens(null);
      await Keychain.resetGenericPassword();
    }
  };

  return (
    <AuthContext.Provider
      value={{ tokens, login, logout, refreshTokens, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook do używania w komponentach
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};