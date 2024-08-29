import { baseApi } from "@/Redux/api/baseApi";
const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: (args) => {
        return {
          url: `cp?limit=10&page=${args?.page}&${args?.search && `search=${args?.search}`}`,
          method: 'GET'
        }
      },
    }),
  }),
});

export const { useGetAllTransactionQuery } = transactionApi;
