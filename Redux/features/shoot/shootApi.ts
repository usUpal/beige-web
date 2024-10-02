import { baseApi } from "@/Redux/api/baseApi";

// Inject endpoints into the base API
const shootApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllShoot: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        // Handle args if provided
        if (args && typeof args === 'object') {
          Object.entries(args)?.forEach(([key, value]) => {
            // Only append if value is defined and not null
            if (value !== undefined && value !== null) {
              params.append(key, value.toString());
            }
          });
        }
        const queryString = params.toString();
        return {
          url: `orders${queryString ? '?' + queryString : ''}`, // Include params if they exist
          method: 'GET',
        };
      },
      // transformResponse: (response: any) => {
      //     return {
      //         data: response,
      //     };
      // }
    }),
    getShootDetails: builder.query({
      query: (id) => {
        return {
          url: `orders/${id}?populate=cp_ids`,
          method: 'GET',
        };
      }
    }),
    postOrder: builder.mutation({
      query: (data) => {
        return {
          url: 'orders',
          method: 'POST',
          body: data,
        }
      },
    }),
    updateOrder: builder.mutation({
      query: (data) => {
        return {
          url: `orders/${data?.id}`,
          method: 'PATCH',
          body: data?.requestData,
        }
      },
    }),

    deleteOrder: builder.mutation({
      query: (data) => {
        return {
          url: `orders/${data?.id}`,
          method: 'DELETE',
          body: data.addOns._id,
        };
      },
    }),

    updateStatus: builder.mutation({
      query: (data) => {
        return {
          url: `orders/${data?.id}`,
          method: 'PATCH',
          body: JSON.stringify({ order_status: data?.order_status }),
        }
      },
    }),
    assignCp: builder.mutation({
      query: (data) => {
        return {
          url: `orders/${data?.id}`,
          method: 'PATCH',
          body: JSON.stringify({ cp_ids: data?.cp_ids })
        }
      }
    }),
    // 
    addAddons: builder.mutation({
      query: ( data ) => {
        return {
          url: `orders/${data?.id}`,
          method: 'PATCH',
          body: JSON.stringify({ addOns: data?.addOns  }),
        };
      },
    }),

    getAlgoCp: builder.query({
      query: (data) => {
        return {
          url: `algo?orderID=${data}&page=1&limit=10`,
          method: 'GET'
        }
      }
    })
  }),
  overrideExisting: true,
});

export const { useGetAllShootQuery, useGetShootDetailsQuery, usePostOrderMutation, useUpdateStatusMutation, useAssignCpMutation, useLazyGetAlgoCpQuery, useUpdateOrderMutation, useDeleteOrderMutation, useAddAddonsMutation } = shootApi;
