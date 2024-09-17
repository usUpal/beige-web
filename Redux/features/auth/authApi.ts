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
    }),

    // create client
    createClient: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    })

  }),
});

export const { useLoginMutation, useLazyGetAuthPermissionsQuery, useCreateClientMutation } = authApi;
