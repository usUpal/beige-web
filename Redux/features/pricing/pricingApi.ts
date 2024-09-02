import { baseApi } from "@/Redux/api/baseApi";

// Inject endpoints into the base API
const priceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPricing: builder.query({
            query: () => {
                return {
                    url: `prices`,
                    method: 'GET',
                };
            }
        }),

    }),
});

export const { useGetAllPricingQuery } = priceApi;
