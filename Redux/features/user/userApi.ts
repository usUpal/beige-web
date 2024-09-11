import { baseApi } from "@/Redux/api/baseApi";
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCp: builder.query({
      query: (args) => {
        return {
          url: `cp?limit=10&page=${args?.page}&${args?.search && `search=${args?.search}`}`,
          method: 'GET'
        }
      },
    }),
    getAllUser: builder.query({
      query: (args) => {
        const roleParam = args?.role ? `&role=${args.role}` : '';
        const url = `users?limit=10&page=${args?.page}${roleParam}`;
        return {
          url,
          method: "GET",
        };
      }
    }),

    getUserDetails: builder.query({
      query: (data) => {
        return {
          url: `users/${data}`,
          method: "GET",
        }
      }
    }),
    getCpDetails: builder.query({
      query: (data) => {
        return {
          url: `cp/${data?.id}`,
          method: "GET",
        }
      }
    }),
    updateCpById: builder.mutation({
      query: (data) => {
        return {
          url: `cp/${data?.id}?role=admin`,
          method: "PATCH",
          body: data?.formData
        }
      }
    }),
  }),
});

export const { useGetAllCpQuery, useGetAllCpsQuery, useGetAllUserQuery, useLazyGetUserDetailsQuery, useLazyGetCpDetailsQuery, useUpdateCpByIdMutation } = userApi;
