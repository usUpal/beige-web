import { baseApi } from "@/Redux/api/baseApi";

const chatsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllChats: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                // Handle args if provided
                if (args && typeof args === 'object') {
                    Object.entries(args).forEach(([key, value]) => {
                        // Only append if value is defined and not null
                        if (value !== undefined && value !== null) {
                            params.append(key, value.toString());
                        }
                    });
                }
                const queryString = params.toString();
                return {
                    url: `chats${queryString ? '?' + queryString : ''}`, 
                    method: 'GET',
                };
            },
        }),
    }),
    overrideExisting: true,
});

export const { getAllChats } = chatsApi;