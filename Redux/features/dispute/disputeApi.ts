import { baseApi } from "@/Redux/api/baseApi";

const disputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDisputes: builder.query({
      query: (data) => {
        let url = `disputes?sortBy=createdAt:desc&limit=10&page=${data?.currentPage}`;
        if (data?.userData?.role === 'client' || data?.userData?.role === 'cp') {
          url = `disputes/user/${data?.userData?.id}?sortBy=createdAt:desc&limit=10&page=${data?.currentPage}`;
        }
        return {
          url: url,
          method: 'GET',
        };
      }
    }),
    getDisputesDetails: builder.query({
      query: (data) => {
        return {
          url: `disputes/${data}`,
          method: "GET"
        }
      }
    }),

    updateDisputeStatus: builder.mutation({
      query: (data) => {
        
        return {
          url: `disputes/${data?.id}`,
          method: 'PATCH',
          body: JSON.stringify({ status: data?.status }),
        }
      },
    }),

  }),
});

export const { useGetAllDisputesQuery, useLazyGetDisputesDetailsQuery, useUpdateDisputeStatusMutation } = disputeApi;
