import { baseApi } from "@/Redux/api/baseApi";

// Define the API service with your endpoints
const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllChatQuery: builder.query({
            query: (args) => {
                // console.log(args);
             
                return {
                url: `chats/?sortBy=updatedAt:desc&populate=order_id,last_message,cp_ids.id,client_id,manager_ids.id&${args?.userRole}_id=${args?.userD}`, 
                method: 'GET',
                };
            },
        }),
        getChatDetails: builder.query({
      query: (roomId) => {
        return {
          url: `chats/${roomId}?limit=20&page=1`,
          method: 'GET',
        };
      }
    }),
    }),
    overrideExisting: true,
});

// Export the auto-generated hook
export const { useGetAllChatQueryQuery, useGetChatDetailsQuery } = chatApi;
