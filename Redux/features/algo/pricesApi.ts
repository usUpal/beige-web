import { baseApi } from '../../api/baseApi';

const prices = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updatePrice: builder.mutation({
            query: (args) => ({
                url: `prices/${args.id}`,
                method: 'PATCH',
                body: JSON.stringify({ rate: args?.rate }),
            }),
        }),
    }),
});

export const { useUpdatePriceMutation } = prices;
