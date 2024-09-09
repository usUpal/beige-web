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
    const token: any = JSON.parse(Cookies.get('accessToken'));
    if (token?.token) {
      headers.set('authorization', `Bearer ${token?.token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.data?.code === 401 || result?.code === 403) {
    //* Send Refresh
    const tokens: any = JSON.parse(Cookies.get('refreshToken'));
    const res = await fetch(`${API_ENDPOINT}auth/refresh-tokens`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken: tokens?.token }),
    });

    const data = await res.json();

    if (data) {
      Cookies.set('accessToken', JSON.stringify(data?.tokens?.access?.token));
      Cookies.set('refreshToken', JSON.stringify(data?.tokens?.refresh?.token));
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('Here is need to logout')
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['shoot', 'metting', 'chat'],
  endpoints: () => ({}),
});
