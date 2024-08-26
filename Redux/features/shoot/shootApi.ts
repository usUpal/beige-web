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
            query: (data) => ({
                url: 'orders',
                method: 'POST',
                body: data,
            }),
        })
        // Add more endpoints here if needed
    }),
});

export const { useGetAllShootQuery, useGetShootDetailsQuery, usePostOrderMutation } = shootApi;
