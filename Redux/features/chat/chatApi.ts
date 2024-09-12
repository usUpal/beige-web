import { baseApi } from "@/Redux/api/baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getAllChat: builder.query({
        query: (args) => {
          return {
          url: `chats/?sortBy=updatedAt:desc&populate=order_id,last_message,cp_ids.id,client_id,manager_ids.id&${args?.userRole}_id=${args?.userD}`, 
          method: 'GET',
          };
        },
      }),
  
      getChatDetails: builder.query({
        query: ({ roomId, page = 1 }) => {
          console.log(roomId);
          
          return {
            url: `chats/${roomId}?limit=20&page=${page}`,
            method: 'GET',
          };
        },
      }),
 
  }),
    overrideExisting: true,
});

export const { useGetAllChatQuery, useLazyGetChatDetailsQuery } = chatApi;
