import store from '../store/index';
import { Provider } from 'react-redux';
import { createContext, useContext, useEffect, useState, ReactNode, Fragment } from 'react';
import { AuthContextType, AuthProviderProps, UserData, Token } from '@/types/authTypes';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import LoginBoxed from '@/pages/auth/signin';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<Token | null>(null);
  const [refreshToken, setRefreshToken] = useState<Token | null>(null);

  const router = useRouter();

  const providerData = {
    userData, setUserData, accessToken, setAccessToken, refreshToken, setRefreshToken
  };

  const userDataCookie = Cookies.get('userData');
  const accessTokenCookie = Cookies.get('accessToken');
  const refreshTokenCookie = Cookies.get('refreshToken');

  if (userDataCookie) {
    setUserData(JSON.parse(userDataCookie));
  }
  if (accessTokenCookie) {
    setAccessToken(JSON.parse(accessTokenCookie));
  }
  if (refreshTokenCookie) {
    setRefreshToken(JSON.parse(refreshTokenCookie));
  }

  return (
    <AuthContext.Provider value={providerData}>
      {(!accessToken || !refreshToken) ? (
        <Provider store={store}>
          <LoginBoxed></LoginBoxed>
        </Provider>
      ) : (
        <Fragment>{children}</Fragment>
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
