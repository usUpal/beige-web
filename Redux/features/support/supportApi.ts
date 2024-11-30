import { baseApi } from "@/Redux/api/baseApi";
const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupports: builder.query({
            query: (args) => {
              let url = `orders?sortBy=createdAt:desc&limit=10&page=${args?.page}`;
              if (args?.id === 'client') {
                url = `orders?sortBy=createdAt:desc&limit=10&page=${args?.page}&client_id=${args?.user?.id}`;
              } else if (args?.user?.role === 'cp') {
                url = `orders?sortBy=createdAt:desc&limit=10&page=${args?.page}&cp_id=${args?.user?.id}`;
              }
                return {
                    url,
                    method: 'GET',
                };
            },
        })
    }),
});

export const { useGetAllSupportsQuery } = supportApi;
