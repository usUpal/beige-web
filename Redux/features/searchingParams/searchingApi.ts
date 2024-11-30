import { baseApi } from "@/Redux/api/baseApi";

// Inject endpoints into the base API
const searchingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSearchingParams: builder.query({
            query: () => {
                return {
                    url: `settings/algo/search`,
                    method: 'GET',
                };
            }
        }),
        updateSearchingParams: builder.mutation({
            query: (data) => {
                return {
                    url: `settings/algo/search`,
                    method: 'PATCH',
                    body: data,
                };
            }
        }),

    }),
});

export const { useGetAllSearchingParamsQuery, useUpdateSearchingParamsMutation } = searchingApi;
