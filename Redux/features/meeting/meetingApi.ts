import { baseApi } from "@/Redux/api/baseApi";

const meetingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMeetings: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === 'object') {
          Object.entries(args)?.forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, value.toString());
            }
          });
        }
        const queryString = params.toString();
        return {
          url: `meetings${queryString ? '?' + queryString : ''}`,
          method: 'GET',
        };
      },
    }),
    getMeetingDetails: builder.query({
      query: (id) => {
        return {
          url: `meetings/${id}`,
          method: 'GET',
        };
      }
    }),
    updateReschedule: builder.mutation({
      query: (data) => ({
        url: `meetings/schedule/${data?.id}`,
        method: 'PATCH',
        body: data?.requestBody
      })
    })

  }),
});



export const { useGetAllMeetingsQuery, useLazyGetMeetingDetailsQuery, useUpdateRescheduleMutation } = meetingApi;
