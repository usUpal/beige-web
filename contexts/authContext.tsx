import { Provider } from 'react-redux';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import store from '../store/index';
import Cookies from 'js-cookie';
import Auth from '@/components/Auth';
import { useRouter } from 'next/router';
import { AuthContextType, AuthProviderProps, UserData, Token } from '@/types/authTypes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authPermissions, setAuthPermissions] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<Token | null>(null);
  const [refreshToken, setRefreshToken] = useState<Token | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = ['userData', 'authPermissions', 'accessToken', 'refreshToken'];

    cookies.forEach((cookie) => {
      const cookieValue = Cookies.get(cookie);

      if (cookieValue) {
        try {
          const parsedValue = JSON.parse(cookieValue);
          switch (cookie) {
            case 'userData':
              setUserData(parsedValue);
              break;
            case 'authPermissions':
              setAuthPermissions(parsedValue);
              break;
            case 'accessToken':
              setAccessToken(parsedValue?.token || null);
              break;
            case 'refreshToken':
              setRefreshToken(parsedValue?.token || null);
              break;
            default:
              break;
          }
        } catch (error) {
          // console.error(`Error parsing ${cookie} cookie:`, error);
        }
      }
    });

    setReady(true);
  }, []);

  const providerData = {
    userData,
    setUserData,
    authPermissions,
    setAuthPermissions,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
  };

  const publicRoutes = ['/verify-email', '/password-reset', '/login', '/register'];
  const isAuthRequired = !publicRoutes.includes(router.pathname);

  return (
    <AuthContext.Provider value={providerData}>
      {ready && (
        <>
          {isAuthRequired && !refreshToken ? (
            <Provider store={store}>
              <Auth />
            </Provider>
          ) : (
            children
          )}
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
