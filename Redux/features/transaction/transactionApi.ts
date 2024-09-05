import { baseApi } from "@/Redux/api/baseApi";
const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: (args) => {
        let URL;
        if (args?.userData?.role == 'admin') {
          URL = `payout?sortBy=createdAt:desc&limit=10&page=${args?.page}`;
        } else {
          URL = `payout?userId=${args?.userData?.id}&sortBy=${args?.sortBy}&limit=${args?.limit}&page=${args?.page}`;
        }

        return {
          url: URL,
          method: 'GET'
        }
      },
    }),
    updateTransactionStatus: builder.mutation({
      query: (data) => {
        return {
          url: `payout/${data?.id}`,
          method: 'PATCH',
          body: JSON.stringify({ status: data?.status }),
        }
      },
    }),
  }),
});

export const { useGetAllTransactionQuery, useUpdateTransactionStatusMutation } = transactionApi;
