import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getAuthPermissions: builder.query({
      query: (data) => {
        return {
          url: `roles?search=${data}`,
          method: 'GET'
        }
      }
    })
  }),
});

export const { useLoginMutation, useLazyGetAuthPermissionsQuery } = authApi;
