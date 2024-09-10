import { baseApi } from "@/Redux/api/baseApi";
import { method } from "lodash";
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
      query:(args) => {
        return {
          url : `users?limit=10&page=${args?.page}`,
          method:"GET",
        }
      }
    }),

    getUserDetails : builder.query({
      query:(data) => {
        return {
          url : `users/${data}`,
          method:"GET",
        }
      }
    })
  }),
});

export const { useGetAllCpQuery ,useGetAllUserQuery,useLazyGetUserDetailsQuery} = userApi;
