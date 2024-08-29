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
  }),
});

export const { useGetAllCpQuery } = userApi;
