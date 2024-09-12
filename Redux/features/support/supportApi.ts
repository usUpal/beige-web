import { baseApi } from "@/Redux/api/baseApi";
const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupports: builder.query({
            query: (args) => {
                const roleParam = args?.role ? `&role=${args.role}` : '';
                const searchParam = args?.search ? `&search=${encodeURIComponent(args.search)}` : '';
                const url = `users?limit=10&page=${args?.page || 1}${roleParam}${searchParam}`;
                return {
                    url,
                    method: 'GET',
                };
            },
        })
    }),
});

export const { useGetAllSupportsQuery } = supportApi;
