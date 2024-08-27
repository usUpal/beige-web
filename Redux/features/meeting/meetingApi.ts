import { baseApi } from "@/Redux/api/baseApi";
import { useAuth } from '@/contexts/authContext';




// Inject endpoints into the base API
const meetingApi = baseApi.injectEndpoints({
    
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
        }),

        getAllMeeting: builder.query({
            query: (args) => {
                const { userData } = useAuth();
                const userRole = userData?.role === 'user' ? 'client' : userData?.role;
                let url = `meetings?sortBy=createdAt:desc`;
                if (userRole === 'client' || userRole === 'cp') {
                    url = `meetings/user/${userData?.id}?sortBy=createdAt:desc`;
                }
                return {
                    url: url,
                    method: 'GET',
                };
               
            }
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

export const { useGetAllShootQuery, useGetAllMeetingQuery, useGetShootDetailsQuery, usePostOrderMutation } = meetingApi;
