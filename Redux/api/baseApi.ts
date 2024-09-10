import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { API_ENDPOINT } from '@/config';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  credentials: 'omit',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    // Try to get accessToken from cookies
    const token = Cookies.get('accessToken');
    if (token) {
      const parsedToken = JSON.parse(token);
      headers.set('authorization', `Bearer ${parsedToken}`);
    } else {
      console.log("🚀 ~ No access token found, trying refresh token...");
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);
  // If we get a 403 (accessToken expired or unauthorized), attempt to refresh
  if (result?.error?.status === 403) {
    // Try to get the refreshToken from cookies
    let refreshToken;
    try {
      const refreshTokenString = Cookies.get('refreshToken');
      if (refreshTokenString) {
        refreshToken = JSON.parse(refreshTokenString);
      } else {
        refreshToken = null;
      }
    } catch (error) {
      refreshToken = null;
    }

    // If the refreshToken is not available, log out the user
    if (!refreshToken?.token) {
      Cookies.remove('userData');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      return { error: { status: 403, message: 'Logged out due to missing refresh token' } };
    }

    // If refreshToken is available, request a new accessToken
    const refreshResponse = await fetch(`${API_ENDPOINT}auth/refresh-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshToken.token }),
    });

    const refreshData = await refreshResponse.json();
    if (refreshData?.access?.token) {
      // Store the new access token in cookies
      Cookies.set('accessToken', JSON.stringify(refreshData.access.token));

      // Retry the original request with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      Cookies.remove('userData');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      return { error: { status: 403, message: 'Failed to refresh token, logged out' } };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['shoot', 'meeting', 'chat'],
  endpoints: () => ({}),
});
