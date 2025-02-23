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
        const searchParam = args?.search ? `&search=${encodeURIComponent(args.search)}` : '';
        const url = `users?limit=10&page=${args?.page || 1}${roleParam}${searchParam}`;
        return {
          url,
          method: 'GET',
        };
      },
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

    registerUser: builder.mutation({
      query: (clientCreationData) => {
        return {
          url: `auth/register`,
          method: 'POST',
          body: clientCreationData,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    registerCp: builder.mutation({
      query: (cpData) => {
        return {
          url: `cp`,
          method: 'POST',
          body: cpData,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  }),
});

export const { useGetAllCpQuery, useGetAllUserQuery, useLazyGetUserDetailsQuery, 
  useLazyGetCpDetailsQuery, useUpdateCpByIdMutation,
   useRegisterUserMutation, useRegisterCpMutation } = userApi;
