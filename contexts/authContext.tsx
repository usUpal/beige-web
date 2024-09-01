import store from '../store/index';
import { Provider } from 'react-redux';
import { createContext, useContext, useEffect, useState, ReactNode, Fragment } from 'react';
import { AuthContextType, AuthProviderProps, UserData, Token, UserRole } from '@/types/authTypes';
import Cookies from 'js-cookie';
import Auth from '@/components/Auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [authPermissions, setAuthPermissions] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<Token | null>(null);
  const [refreshToken, setRefreshToken] = useState<Token | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {

    const userDataCookie = Cookies.get('userData');
    const authPermissionsCookie = Cookies.get('authPermissions');
    const accessTokenCookie = Cookies.get('accessToken');
    const refreshTokenCookie = Cookies.get('refreshToken');

    if (!userData && userDataCookie) {
      setUserData(JSON.parse(userDataCookie));
    }

    if (!authPermissions && authPermissionsCookie) {
      setAuthPermissions(JSON.parse(authPermissionsCookie));
    }

    if (!accessToken && accessTokenCookie) {
      setAccessToken(JSON.parse(accessTokenCookie)?.token);
    }

    if (!refreshToken && refreshTokenCookie) {
      setRefreshToken(JSON.parse(refreshTokenCookie)?.token);
    }

    setReady(true);

  }, []);

  const providerData = {
    userData, setUserData,
    authPermissions, setAuthPermissions,
    accessToken, setAccessToken,
    refreshToken, setRefreshToken
  };

  return (
    <AuthContext.Provider value={providerData}>
      {ready && (
        <Fragment>
          {(accessToken && refreshToken) ? (
            <Fragment>{children}</Fragment>
          ) : (
            <Provider store={store}>
              <Auth />
            </Provider>
          )}
        </Fragment>
      )}
    </AuthContext.Provider>
  );


};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
