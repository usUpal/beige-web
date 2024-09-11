import { baseApi } from "@/Redux/api/baseApi";

const profileFormApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendFromProfile: builder.mutation({
      query: (userData) => ({
        // users/${userData?.id}
        url: `users/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          name: userData.name,
          location: userData.location,
          email: userData.email
        }),
      }),
    }),
    sendCpData: builder.mutation({
      query: (userData) => ({
        url: `cp/${userData.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          geo_location: userData.geo_location,
          city: userData.location
        }),
      }),
    }),
  }),
});

export const { useSendFromProfileMutation, useSendCpDataMutation } = profileFormApi;
