import { baseApi } from "@/Redux/api/baseApi";

const profileUpdate = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInfo: builder.mutation({
      query: (userData) => ({
        url: `users/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify(userData?.data),
      }),
    }),
    updateCpDataForLocation: builder.mutation({
      query: (userData) => ({
        url: `cp/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify(userData?.data),
      }),
    }),
  }),
});

export const { useUpdateUserInfoMutation, useUpdateCpDataForLocationMutation } = profileUpdate;
