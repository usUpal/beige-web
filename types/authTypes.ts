// authTypes.ts
import { ReactNode } from 'react';

export type UserData = {
  role: string;
  isEmailVerified: boolean;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

export type Token = {
  token: string;
  expires: Date;
};

export type AuthContextType = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  accessToken: Token | null;
  setAccessToken: (data: Token | null) => void;
  refreshToken: Token | null;
  setRefreshToken: (data: Token | null) => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};
